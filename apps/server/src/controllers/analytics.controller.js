import { User } from '../models/User.js';
import { StudentProfile } from '../models/StudentProfile.js';
import { Job } from '../models/Job.js';
import { JobApplication } from '../models/JobApplication.js';
import { AIUsage } from '../models/AIUsage.js';
import { AuditLog } from '../models/AuditLog.js';
import mongoose from 'mongoose';
// 1. Student Dashboard Analytics (Grades, Applications, Attendance)
export const getStudentAnalytics = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        
        // Execute queries concurrently
        const [applications, profile] = await Promise.all([
            JobApplication.aggregate([
                { $match: { student: new mongoose.Types.ObjectId(userId) } },
                { $group: { _id: '$status', count: { $sum: 1 } } },
            ]),
            StudentProfile.findOne({ user: userId })
                .select('skills cgpa placementReadinessScore')
                .lean()
        ]);

        const statusCounts = applications.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {});

        res.status(200).json({
            success: true,
            data: {
                applicationStatus: statusCounts,
                skillsCount: profile?.skills?.length || 0,
                cgpa: profile?.cgpa || 0.0,
                readinessScore: profile?.placementReadinessScore || 0,
                attendance: 88, // Mock default attendance percentage for demo consistency
            },
        });
    }
    catch (error) {
        next(error);
    }
};
// 2. Placement Officer Dashboard Analytics (Placement Rate, Company statistics)
export const getPlacementAnalytics = async (req, res, next) => {
    try {
        // Run aggregations and counts in parallel
        const [totalJobs, totalApplications, statusSummary, totalStudents] = await Promise.all([
            Job.countDocuments(),
            JobApplication.countDocuments(),
            JobApplication.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } },
            ]),
            StudentProfile.countDocuments()
        ]);

        const applicationsByStatus = statusSummary.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {});

        // Calculate placement rate
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
    }
    catch (error) {
        next(error);
    }
};
// 3. Admin Dashboard Analytics (User management, system costs, tokens)
export const getAdminAnalytics = async (req, res, next) => {
    try {
        // Run all admin aggregate counters in parallel
        const [usersByRole, tokenCosts, auditCount] = await Promise.all([
            User.aggregate([
                { $group: { _id: '$role', count: { $sum: 1 } } },
            ]),
            AIUsage.aggregate([
                {
                    $group: {
                        _id: null,
                        totalPrompt: { $sum: '$promptTokens' },
                        totalCompletion: { $sum: '$completionTokens' },
                        totalTokens: { $sum: '$totalTokens' },
                    },
                },
            ]),
            AuditLog.countDocuments()
        ]);

        const rolesCount = usersByRole.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {});

        res.status(200).json({
            success: true,
            data: {
                usersByRole: rolesCount,
                tokensSummary: tokenCosts[0] || { totalPrompt: 0, totalCompletion: 0, totalTokens: 0 },
                auditLogsCount: auditCount,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
