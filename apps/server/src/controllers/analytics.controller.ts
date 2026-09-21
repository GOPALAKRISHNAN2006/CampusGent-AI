import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { StudentProfile } from '../models/StudentProfile';
import { Job } from '../models/Job';
import { JobApplication } from '../models/JobApplication';
import { AIUsage } from '../models/AIUsage';
import { AuditLog } from '../models/AuditLog';
import mongoose from 'mongoose';

// 1. Student Dashboard Analytics (Grades, Applications, Attendance)
export const getStudentAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;

    // Aggregate applications status counts
    const applications = await JobApplication.aggregate([
      { $match: { student: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const statusCounts = applications.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {} as Record<string, number>);

    // Fetch CGPA and skill count from student profile
    const profile = await StudentProfile.findOne({ user: userId });

    res.status(200).json({
      success: true,
      data: {
        applicationStatus: statusCounts,
        skillsCount: profile?.skills.length || 0,
        cgpa: profile?.cgpa || 0.0,
        readinessScore: profile?.placementReadinessScore || 0,
        attendance: 88, // Mock default attendance percentage for demo consistency
      },
    });
  } catch (error) {
    next(error);
  }
};

// 2. Placement Officer Dashboard Analytics (Placement Rate, Company statistics)
export const getPlacementAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const totalJobs = await Job.countDocuments();
    const totalApplications = await JobApplication.countDocuments();
    
    // Group applications by status
    const statusSummary = await JobApplication.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const applicationsByStatus = statusSummary.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {} as Record<string, number>);

    // Calculate placement rate
    const totalStudents = await StudentProfile.countDocuments();
    const hiredApplicationsCount = applicationsByStatus['SELECTED'] || 0;
    const placementRate = totalStudents > 0 ? Math.round((hiredApplicationsCount / totalStudents) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        totalJobs,
        totalApplications,
        placementRate,
        applicationsByStatus,
        averageSalary: 7.5, // LPA (mock metric summary for charts rendering)
      },
    });
  } catch (error) {
    next(error);
  }
};

// 3. Admin Dashboard Analytics (User management, system costs, tokens)
export const getAdminAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Count users by role
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);

    const rolesCount = usersByRole.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {} as Record<string, number>);

    // Count total AI usage tokens
    const tokenCosts = await AIUsage.aggregate([
      {
        $group: {
          _id: null,
          totalPrompt: { $sum: '$promptTokens' },
          totalCompletion: { $sum: '$completionTokens' },
          totalTokens: { $sum: '$totalTokens' },
        },
      },
    ]);

    const auditCount = await AuditLog.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        usersByRole: rolesCount,
        tokensSummary: tokenCosts[0] || { totalPrompt: 0, totalCompletion: 0, totalTokens: 0 },
        auditLogsCount: auditCount,
      },
    });
  } catch (error) {
    next(error);
  }
};
