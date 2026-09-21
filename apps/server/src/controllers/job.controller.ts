import { Request, Response, NextFunction } from 'express';
import { JobCreateSchema, JobStatus, ApplicationStatus } from '@campusgent/shared';
import { Job } from '../models/Job';
import { JobApplication } from '../models/JobApplication';
import { StudentProfile } from '../models/StudentProfile';
import { Notification } from '../models/Notification';
import { AuditLog } from '../models/AuditLog';
import { Interview } from '../models/Interview';
import { BadRequestError, NotFoundError, ForbiddenError } from '../utils/errors';
import mongoose from 'mongoose';

// 1. Create Job Listing (Placement Officer / Admin)
export const createJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = JobCreateSchema.parse(req.body);

    const job = await Job.create({
      title: validatedData.title,
      companyName: validatedData.companyName,
      description: validatedData.description,
      location: validatedData.location,
      employmentType: validatedData.employmentType,
      salaryMin: validatedData.salaryMin,
      salaryMax: validatedData.salaryMax,
      requiredSkills: validatedData.requiredSkills,
      experienceRequired: validatedData.experienceRequired,
      eligibilityCriteria: {
        minCgpa: validatedData.minCgpa,
        allowedDepartments: validatedData.allowedDepartments.map((d) => new mongoose.Types.ObjectId(d)),
        maxBacklogsAllowed: validatedData.maxBacklogsAllowed,
      },
      applicationDeadline: new Date(validatedData.applicationDeadline),
      status: JobStatus.ACTIVE,
    });

    // Audit Log
    await AuditLog.create({
      user: req.user?.id,
      action: 'CREATE_JOB',
      details: { jobId: job._id, title: job.title, company: job.companyName },
    });

    res.status(201).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// 2. Get Job Listings with Search and Pagination
export const getJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, companyName, location, employmentType, status, page = '1', limit = '10' } = req.query;

    const query: any = {};

    // Search filters
    if (title) query.title = { $regex: String(title), $options: 'i' };
    if (companyName) query.companyName = { $regex: String(companyName), $options: 'i' };
    if (location) query.location = { $regex: String(location), $options: 'i' };
    if (employmentType) query.employmentType = String(employmentType);

    // Students can only see active listings
    if (req.user?.role === 'STUDENT') {
      query.status = JobStatus.ACTIVE;
    } else if (status) {
      query.status = String(status);
    }

    const pageNum = parseInt(String(page), 10);
    const limitNum = parseInt(String(limit), 10);
    const skipNum = (pageNum - 1) * limitNum;

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .skip(skipNum)
      .limit(limitNum)
      .populate('eligibilityCriteria.allowedDepartments', 'name code');

    const total = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        jobs,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// 3. Get Job details
export const getJobById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('eligibilityCriteria.allowedDepartments', 'name code');

    if (!job) {
      throw new NotFoundError('Job posting not found');
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// 4. Update Job listing
export const updateJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) {
      throw new NotFoundError('Job posting not found');
    }

    // Audit Log
    await AuditLog.create({
      user: req.user?.id,
      action: 'UPDATE_JOB',
      details: { jobId: job._id },
    });

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// 5. Apply for a Job (Student only)
export const applyJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ForbiddenError('Student authentication required');
    }

    const { jobId, resumeUrl, notes } = req.body;
    if (!jobId) {
      throw new BadRequestError('Job ID is required');
    }

    const job = await Job.findById(jobId);
    if (!job) {
      throw new NotFoundError('Job posting not found');
    }

    // Check status
    if (job.status !== JobStatus.ACTIVE) {
      throw new BadRequestError('Applications for this job are closed');
    }

    // Check deadline
    if (new Date() > new Date(job.applicationDeadline)) {
      throw new BadRequestError('Application deadline has passed');
    }

    // Fetch student profile for eligibility evaluation
    const student = await StudentProfile.findOne({ user: userId });
    if (!student) {
      throw new ForbiddenError('Complete your student profile before applying');
    }

    // 1. CGPA eligibility
    if (student.cgpa < job.eligibilityCriteria.minCgpa) {
      throw new BadRequestError(`CGPA criteria not met. Required minimum: ${job.eligibilityCriteria.minCgpa}`);
    }

    // 2. Department eligibility
    if (job.eligibilityCriteria.allowedDepartments.length > 0) {
      const isDeptAllowed = job.eligibilityCriteria.allowedDepartments.some(
        (deptId) => deptId.toString() === student.department.toString()
      );
      if (!isDeptAllowed) {
        throw new BadRequestError('Your department is not eligible for this role');
      }
    }

    // Prevent duplicate applications
    const existingApplication = await JobApplication.findOne({ student: userId, job: jobId });
    if (existingApplication) {
      throw new BadRequestError('You have already applied for this job');
    }

    const application = await JobApplication.create({
      student: userId,
      job: jobId,
      status: ApplicationStatus.APPLIED,
      resumeUrl: resumeUrl || student.resumeUrl,
      notes,
      timeline: [
        {
          status: ApplicationStatus.APPLIED,
          updatedAt: new Date(),
          updatedBy: new mongoose.Types.ObjectId(userId),
          remarks: 'Application submitted successfully',
        },
      ],
    });

    // Notify Placement Officers
    await Notification.create({
      recipient: new mongoose.Types.ObjectId(userId), // Student receipt
      type: 'placement',
      title: 'Application Submitted',
      message: `You applied successfully for ${job.title} at ${job.companyName}.`,
    });

    res.status(201).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// 6. Get Student Applications
export const getStudentApplications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    const applications = await JobApplication.find({ student: userId })
      .populate('job', 'title companyName location employmentType status')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// 7. Get applications for a specific job (Placement Officer / Admin)
export const getJobApplications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { jobId } = req.params;
    const applications = await JobApplication.find({ job: jobId })
      .populate('student', 'name email')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// 8. Update Application Status (Placement Officer / Admin)
export const updateApplicationStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    if (!status || !Object.values(ApplicationStatus).includes(status)) {
      throw new BadRequestError('Invalid application status');
    }

    const application = await JobApplication.findById(id).populate('job', 'title companyName');
    if (!application) {
      throw new NotFoundError('Job application not found');
    }

    application.status = status;
    application.timeline.push({
      status,
      updatedAt: new Date(),
      updatedBy: new mongoose.Types.ObjectId(req.user?.id),
      remarks,
    });

    await application.save();

    // Notify Student
    const jobDetails = application.job as any;
    await Notification.create({
      recipient: application.student,
      type: 'placement',
      title: `Application Status: ${status}`,
      message: `Your application status for ${jobDetails.title} at ${jobDetails.companyName} has been updated to ${status}. Remarks: ${remarks || 'None'}`,
    });

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// 9. Get all applications globally (Placement Officer / Admin)
export const getAllApplications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user?.role === 'STUDENT') {
      throw new ForbiddenError('You are not authorized to view all applications');
    }

    const applications = await JobApplication.find()
      .populate('student', 'name email')
      .populate('job', 'title companyName location employmentType status salaryMin salaryMax requiredSkills')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// 10. Get all interviews globally (Placement Officer / Admin)
export const getAllInterviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user?.role === 'STUDENT') {
      throw new ForbiddenError('You are not authorized to view all interviews');
    }

    const interviews = await Interview.find()
      .populate('student', 'name email')
      .populate('job', 'title companyName location')
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      data: interviews,
    });
  } catch (error) {
    next(error);
  }
};

// 11. Schedule a new interview (Placement Officer / Admin)
export const scheduleInterview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user?.role === 'STUDENT') {
      throw new ForbiddenError('You are not authorized to schedule interviews');
    }

    const { applicationId, studentId, jobId, date, type, meetingUrl } = req.body;

    const interview = await Interview.create({
      application: new mongoose.Types.ObjectId(applicationId),
      student: new mongoose.Types.ObjectId(studentId),
      job: new mongoose.Types.ObjectId(jobId),
      date: new Date(date),
      type,
      status: 'SCHEDULED',
      meetingUrl,
    });

    // Also update the job application status to 'INTERVIEW'
    await JobApplication.findByIdAndUpdate(applicationId, {
      status: 'INTERVIEW',
      $push: {
        timeline: {
          status: 'INTERVIEW',
          updatedAt: new Date(),
          updatedBy: new mongoose.Types.ObjectId(req.user?.id),
          remarks: `Interview scheduled (${type} round) on ${new Date(date).toLocaleString()}`,
        }
      }
    });

    res.status(201).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    next(error);
  }
};

// 12. Update interview status/feedback (Placement Officer / Admin)
export const updateInterviewStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user?.role === 'STUDENT') {
      throw new ForbiddenError('You are not authorized to update interviews');
    }

    const { id } = req.params;
    const { status, feedback, score } = req.body;

    const interview = await Interview.findByIdAndUpdate(
      id,
      { status, feedback, score },
      { new: true }
    );

    if (!interview) {
      throw new NotFoundError('Interview not found');
    }

    res.status(200).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    next(error);
  }
};
