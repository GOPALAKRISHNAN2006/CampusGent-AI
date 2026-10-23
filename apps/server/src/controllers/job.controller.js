import { JobCreateSchema, JobStatus, ApplicationStatus } from '@campusgent/shared';
import { Job } from '../models/Job.js';
import { JobApplication } from '../models/JobApplication.js';
import { StudentProfile } from '../models/StudentProfile.js';
import { Notification } from '../models/Notification.js';
import { AuditLog } from '../models/AuditLog.js';
import { Interview } from '../models/Interview.js';
import { BadRequestError, NotFoundError, ForbiddenError } from '../utils/errors.js';
import { cacheService } from '../services/cache.service.js';
import mongoose from 'mongoose';
// 1. Create Job Listing (Placement Officer / Admin)
export const createJob = async (req, res, next) => {
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
        // Invalidate cached jobs and analytics
        await cacheService.delByPrefix('jobs:');
        await cacheService.delByPrefix('analytics:');

        res.status(201).json({
            success: true,
            data: job,
        });
    }
    catch (error) {
        next(error);
    }
};
// 2. Get Job Listings with Search and Pagination
export const getJobs = async (req, res, next) => {
    try {
        const { title, companyName, location, employmentType, status, page = '1', limit = '10' } = req.query;
        const query = {};
        // Search filters
        if (title)
            query.title = { $regex: String(title), $options: 'i' };
        if (companyName)
            query.companyName = { $regex: String(companyName), $options: 'i' };
        if (location)
            query.location = { $regex: String(location), $options: 'i' };
        if (employmentType)
            query.employmentType = String(employmentType);
        // Students can only see active listings
        if (req.user?.role === 'STUDENT') {
            query.status = JobStatus.ACTIVE;
        }
        else if (status) {
            query.status = String(status);
        }
        const pageNum = Math.max(parseInt(String(page), 10) || 1, 1);
        const limitNum = Math.min(Math.max(parseInt(String(limit), 10) || 10, 1), 100);
        const skipNum = (pageNum - 1) * limitNum;
        const [jobs, total] = await Promise.all([
            Job.find(query)
                .sort({ createdAt: -1 })
                .skip(skipNum)
                .limit(limitNum)
                .populate('eligibilityCriteria.allowedDepartments', 'name code')
                .lean(),
            Job.countDocuments(query),
        ]);
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
    }
    catch (error) {
        next(error);
    }
};
// 3. Get Job details
export const getJobById = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            throw new BadRequestError('Invalid job identifier');
        }
        const job = await Job.findById(req.params.id)
            .populate('eligibilityCriteria.allowedDepartments', 'name code')
            .lean();
        if (!job) {
            throw new NotFoundError('Job posting not found');
        }
        res.status(200).json({
            success: true,
            data: job,
        });
    }
    catch (error) {
        next(error);
    }
};
// 4. Update Job listing
export const updateJob = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            throw new BadRequestError('Invalid job identifier');
        }
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
        // Invalidate cached jobs
        await cacheService.delByPrefix('jobs:');
        await cacheService.delByPrefix('analytics:');

        res.status(200).json({
            success: true,
            data: job,
        });
    }
    catch (error) {
        next(error);
    }
};
// 5. Apply for a Job (Student only)
export const applyJob = async (req, res, next) => {
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
            const isDeptAllowed = job.eligibilityCriteria.allowedDepartments.some((deptId) => deptId.toString() === student.department.toString());
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
        // Invalidate analytics cache
        await cacheService.delByPrefix('analytics:');

        res.status(201).json({
            success: true,
            data: application,
        });
    }
    catch (error) {
        next(error);
    }
};
// 6. Get Student Applications
export const getStudentApplications = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const applications = await JobApplication.find({ student: userId })
            .populate('job', 'title companyName location employmentType status')
            .sort({ appliedAt: -1 })
            .lean();
        res.status(200).json({
            success: true,
            data: applications,
        });
    }
    catch (error) {
        next(error);
    }
};
// 7. Get applications for a specific job (Placement Officer / Admin)
export const getJobApplications = async (req, res, next) => {
    try {
        const { jobId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            throw new BadRequestError('Invalid job identifier');
        }
        const applications = await JobApplication.find({ job: jobId })
            .populate('student', 'name email')
            .sort({ appliedAt: -1 })
            .lean();
        res.status(200).json({
            success: true,
            data: applications,
        });
    }
    catch (error) {
        next(error);
    }
};
export const VALID_APPLICATION_TRANSITIONS = {
    [ApplicationStatus.APPLIED]: [ApplicationStatus.SCREENING, ApplicationStatus.SHORTLISTED, ApplicationStatus.REJECTED, ApplicationStatus.WITHDRAWN],
    [ApplicationStatus.SCREENING]: [ApplicationStatus.SHORTLISTED, ApplicationStatus.REJECTED, ApplicationStatus.WITHDRAWN],
    [ApplicationStatus.SHORTLISTED]: [ApplicationStatus.INTERVIEW, ApplicationStatus.SELECTED, ApplicationStatus.REJECTED, ApplicationStatus.WITHDRAWN],
    [ApplicationStatus.INTERVIEW]: [ApplicationStatus.INTERVIEW, ApplicationStatus.SELECTED, ApplicationStatus.REJECTED, ApplicationStatus.WITHDRAWN],
    [ApplicationStatus.SELECTED]: [ApplicationStatus.OFFERED, ApplicationStatus.REJECTED, ApplicationStatus.WITHDRAWN],
    [ApplicationStatus.OFFERED]: [ApplicationStatus.OFFER_ACCEPTED, ApplicationStatus.OFFER_REJECTED, ApplicationStatus.WITHDRAWN],
    [ApplicationStatus.OFFER_ACCEPTED]: [],
    [ApplicationStatus.OFFER_REJECTED]: [],
    [ApplicationStatus.REJECTED]: [],
    [ApplicationStatus.WITHDRAWN]: [],
};

// 8. Update Application Status (Placement Officer / Admin)
export const updateApplicationStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new BadRequestError('Invalid application identifier');
        }
        const { status, remarks } = req.body;
        if (!status || !Object.values(ApplicationStatus).includes(status)) {
            throw new BadRequestError('Invalid application status');
        }
        const application = await JobApplication.findById(id).populate('job', 'title companyName');
        if (!application) {
            throw new NotFoundError('Job application not found');
        }

        // Validate state machine transition
        const allowed = VALID_APPLICATION_TRANSITIONS[application.status] || [];
        if (!allowed.includes(status)) {
            throw new BadRequestError(
                `Invalid status transition from ${application.status} to ${status}. Allowed next states: [${allowed.join(', ') || 'None (terminal state)'}]`
            );
        }

        application.status = status;
        application.timeline.push({
            status,
            updatedAt: new Date(),
            updatedBy: new mongoose.Types.ObjectId(req.user?.id),
            remarks: remarks || `Status changed to ${status}`,
        });
        await application.save();

        // Audit Log
        await AuditLog.create({
            user: new mongoose.Types.ObjectId(req.user?.id),
            action: 'UPDATE_APPLICATION_STATUS',
            details: { applicationId: application._id, newStatus: status, remarks },
        });

        // Notify Student
        const jobDetails = application.job;
        await Notification.create({
            recipient: application.student,
            type: 'placement',
            title: `Application Status: ${status}`,
            message: `Your application status for ${jobDetails.title} at ${jobDetails.companyName} has been updated to ${status}. Remarks: ${remarks || 'None'}`,
        });

        await cacheService.delByPrefix('analytics:');

        res.status(200).json({
            success: true,
            data: application,
        });
    }
    catch (error) {
        next(error);
    }
};

// 8.1 Issue Job Offer (Placement Officer / Admin)
export const issueOffer = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new BadRequestError('Invalid application identifier');
        }
        const { packageLpa, designation, joiningLocation, deadline, notes } = req.body;
        if (!packageLpa || Number(packageLpa) <= 0) {
            throw new BadRequestError('A valid positive CTC package (LPA) is required');
        }

        const application = await JobApplication.findById(id).populate('job', 'title companyName');
        if (!application) {
            throw new NotFoundError('Job application not found');
        }

        if (application.status !== ApplicationStatus.SELECTED && application.status !== ApplicationStatus.OFFERED) {
            throw new BadRequestError(`Offers can only be issued for candidates who have been SELECTED. Current status: ${application.status}`);
        }

        const offerDeadline = deadline ? new Date(deadline) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        if (offerDeadline <= new Date()) {
            throw new BadRequestError('Offer acceptance deadline must be in the future');
        }

        application.status = ApplicationStatus.OFFERED;
        application.offerDetails = {
            packageLpa: Number(packageLpa),
            designation: designation || application.job?.title || 'Graduate Trainee',
            joiningLocation: joiningLocation || 'TBD',
            deadline: offerDeadline,
            issuedAt: new Date(),
            issuedBy: new mongoose.Types.ObjectId(req.user.id),
            decisionRemarks: notes || '',
        };

        application.timeline.push({
            status: ApplicationStatus.OFFERED,
            updatedAt: new Date(),
            updatedBy: new mongoose.Types.ObjectId(req.user.id),
            remarks: `Official offer of ${packageLpa} LPA issued. Deadline: ${offerDeadline.toLocaleDateString()}`,
        });

        await application.save();

        await Notification.create({
            recipient: application.student,
            type: 'placement',
            title: '🎉 Job Offer Letter Issued!',
            message: `Congratulations! You received an official offer for ${application.job?.title} at ${application.job?.companyName} (${packageLpa} LPA). Please review and respond by ${offerDeadline.toLocaleDateString()}.`,
        });

        await AuditLog.create({
            user: new mongoose.Types.ObjectId(req.user.id),
            action: 'ISSUE_OFFER',
            details: {
                applicationId: application._id,
                studentId: application.student,
                packageLpa,
                deadline: offerDeadline,
            },
        });

        await cacheService.delByPrefix('analytics:');

        res.status(200).json({
            success: true,
            message: 'Offer successfully extended to candidate',
            data: application,
        });
    } catch (error) {
        next(error);
    }
};

// 8.2 Student Respond to Offer (Accept / Reject)
export const respondToOffer = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new BadRequestError('Invalid application identifier');
        }
        const { decision, remarks } = req.body;
        if (!decision || !['ACCEPT', 'REJECT'].includes(decision.toUpperCase())) {
            throw new BadRequestError("Offer decision must be either 'ACCEPT' or 'REJECT'");
        }

        const application = await JobApplication.findById(id).populate('job', 'title companyName');
        if (!application) {
            throw new NotFoundError('Job application not found');
        }

        if (application.student.toString() !== req.user.id) {
            throw new ForbiddenError('Unauthorized: Only the nominated candidate can respond to this offer');
        }

        if (application.status !== ApplicationStatus.OFFERED) {
            throw new BadRequestError(`Cannot respond to offer. Current application status is '${application.status}'`);
        }

        if (application.offerDetails?.deadline && new Date() > new Date(application.offerDetails.deadline)) {
            throw new BadRequestError('The response deadline for this offer has expired.');
        }

        const isAccept = decision.toUpperCase() === 'ACCEPT';
        const newStatus = isAccept ? ApplicationStatus.OFFER_ACCEPTED : ApplicationStatus.OFFER_REJECTED;

        application.status = newStatus;
        if (!application.offerDetails) application.offerDetails = {};
        application.offerDetails.respondedAt = new Date();
        application.offerDetails.decisionRemarks = remarks || (isAccept ? 'Accepted by candidate' : 'Declined by candidate');

        application.timeline.push({
            status: newStatus,
            updatedAt: new Date(),
            updatedBy: new mongoose.Types.ObjectId(req.user.id),
            remarks: remarks || (isAccept ? 'Candidate accepted official offer' : 'Candidate declined offer'),
        });

        await application.save();

        await AuditLog.create({
            user: new mongoose.Types.ObjectId(req.user.id),
            action: isAccept ? 'ACCEPT_OFFER' : 'REJECT_OFFER',
            details: {
                applicationId: application._id,
                jobId: application.job?._id,
                company: application.job?.companyName,
                remarks,
            },
        });

        await Notification.create({
            recipient: application.student,
            type: 'placement',
            title: isAccept ? 'Offer Acceptance Recorded' : 'Offer Decline Recorded',
            message: isAccept
                ? `You have officially accepted the offer from ${application.job?.companyName}!`
                : `You have declined the offer from ${application.job?.companyName}.`,
        });

        await cacheService.delByPrefix('analytics:');

        res.status(200).json({
            success: true,
            message: isAccept ? 'Offer accepted successfully' : 'Offer declined successfully',
            data: application,
        });
    } catch (error) {
        next(error);
    }
};

// 8.3 Student Withdraw Application
export const withdrawApplication = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new BadRequestError('Invalid application identifier');
        }
        const { remarks } = req.body;

        const application = await JobApplication.findById(id).populate('job', 'title companyName');
        if (!application) {
            throw new NotFoundError('Job application not found');
        }

        if (application.student.toString() !== req.user.id) {
            throw new ForbiddenError('Unauthorized: Only the applicant can withdraw this application');
        }

        const nonWithdrawable = [ApplicationStatus.OFFER_ACCEPTED, ApplicationStatus.WITHDRAWN, ApplicationStatus.REJECTED];
        if (nonWithdrawable.includes(application.status)) {
            throw new BadRequestError(`Cannot withdraw application in status '${application.status}'`);
        }

        application.status = ApplicationStatus.WITHDRAWN;
        application.timeline.push({
            status: ApplicationStatus.WITHDRAWN,
            updatedAt: new Date(),
            updatedBy: new mongoose.Types.ObjectId(req.user.id),
            remarks: remarks || 'Withdrawn by student',
        });

        await application.save();

        await AuditLog.create({
            user: new mongoose.Types.ObjectId(req.user.id),
            action: 'WITHDRAW_APPLICATION',
            details: {
                applicationId: application._id,
                jobId: application.job?._id,
                remarks,
            },
        });

        await cacheService.delByPrefix('analytics:');

        res.status(200).json({
            success: true,
            message: 'Application withdrawn successfully',
            data: application,
        });
    } catch (error) {
        next(error);
    }
};
// 9. Get all applications globally (Placement Officer / Admin)
export const getAllApplications = async (req, res, next) => {
    try {
        if (req.user?.role === 'STUDENT') {
            throw new ForbiddenError('You are not authorized to view all applications');
        }
        const applications = await JobApplication.find()
            .populate('student', 'name email')
            .populate('job', 'title companyName location employmentType status salaryMin salaryMax requiredSkills')
            .sort({ appliedAt: -1 })
            .lean();
        res.status(200).json({
            success: true,
            data: applications,
        });
    }
    catch (error) {
        next(error);
    }
};
// 10. Get all interviews globally (Placement Officer / Admin)
export const getAllInterviews = async (req, res, next) => {
    try {
        if (req.user?.role === 'STUDENT') {
            throw new ForbiddenError('You are not authorized to view all interviews');
        }
        const interviews = await Interview.find()
            .populate('student', 'name email')
            .populate('job', 'title companyName location')
            .sort({ date: 1 })
            .lean();
        res.status(200).json({
            success: true,
            data: interviews,
        });
    }
    catch (error) {
        next(error);
    }
};
// 11. Schedule a new interview (Placement Officer / Admin)
export const scheduleInterview = async (req, res, next) => {
    try {
        if (req.user?.role === 'STUDENT') {
            throw new ForbiddenError('You are not authorized to schedule interviews');
        }
        const { applicationId, studentId, jobId, date, type, meetingUrl } = req.body;
        if (!applicationId || !mongoose.Types.ObjectId.isValid(applicationId)) {
            throw new BadRequestError('A valid applicationId is required');
        }
        const application = await JobApplication.findById(applicationId);
        if (!application) {
            throw new NotFoundError('Job application not found');
        }
        const effectiveStudentId = studentId || application.student;
        const effectiveJobId = jobId || application.job;
        if (!mongoose.Types.ObjectId.isValid(effectiveStudentId) || !mongoose.Types.ObjectId.isValid(effectiveJobId)) {
            throw new BadRequestError('Invalid student or job identifier');
        }
        if (!date) {
            throw new BadRequestError('Interview date is required');
        }

        const interview = await Interview.create({
            application: new mongoose.Types.ObjectId(applicationId),
            student: new mongoose.Types.ObjectId(effectiveStudentId),
            job: new mongoose.Types.ObjectId(effectiveJobId),
            date: new Date(date),
            type: type || 'TECHNICAL',
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
                    remarks: `Interview scheduled (${type || 'TECHNICAL'} round) on ${new Date(date).toLocaleString()}`,
                }
            }
        });

        // Notify Student
        await Notification.create({
            recipient: effectiveStudentId,
            type: 'placement',
            title: '📅 Interview Scheduled',
            message: `An interview (${type || 'TECHNICAL'}) has been scheduled for ${new Date(date).toLocaleString()}.${meetingUrl ? ` Link: ${meetingUrl}` : ''}`,
        });

        // Audit Log
        await AuditLog.create({
            user: new mongoose.Types.ObjectId(req.user.id),
            action: 'SCHEDULE_INTERVIEW',
            details: {
                interviewId: interview._id,
                applicationId,
                studentId: effectiveStudentId,
                type: type || 'TECHNICAL',
                date: new Date(date),
            },
        });

        res.status(201).json({
            success: true,
            data: interview,
        });
    }
    catch (error) {
        next(error);
    }
};
// 12. Update interview status/feedback (Placement Officer / Admin)
export const updateInterviewStatus = async (req, res, next) => {
    try {
        if (req.user?.role === 'STUDENT') {
            throw new ForbiddenError('You are not authorized to update interviews');
        }
        const { id } = req.params;
        const { status, feedback, score } = req.body;
        const interview = await Interview.findByIdAndUpdate(id, { status, feedback, score }, { new: true });
        if (!interview) {
            throw new NotFoundError('Interview not found');
        }
        res.status(200).json({
            success: true,
            data: interview,
        });
    }
    catch (error) {
        next(error);
    }
};
