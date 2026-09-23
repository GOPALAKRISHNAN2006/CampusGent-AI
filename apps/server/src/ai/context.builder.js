import { StudentProfile } from '../models/StudentProfile.js';
import { JobApplication } from '../models/JobApplication.js';
import { Interview } from '../models/Interview.js';
import mongoose from 'mongoose';
export class AIContextBuilder {
    static async buildSnapshot(studentId) {
        const studentObjId = new mongoose.Types.ObjectId(studentId);
        const [profile, applications, interviews] = await Promise.all([
            StudentProfile.findOne({ user: studentObjId })
                .select('cgpa semester skills projects')
                .lean(),
            JobApplication.find({ student: studentObjId })
                .select('job status')
                .populate('job', 'title companyName')
                .sort({ appliedAt: -1 })
                .limit(10)
                .lean(),
            Interview.find({ student: studentObjId })
                .select('job type status score')
                .populate('job', 'title')
                .sort({ date: -1 })
                .limit(10)
                .lean(),
        ]);
        return {
            studentId: studentId,
            academic: {
                cgpa: profile?.cgpa || 0.0,
                semester: profile?.semester || 1,
                backlogs: 0, // Fallback default
                attendance: 88, // Fallback default consistent with student metrics
            },
            skills: (profile?.skills || []).map((s) => ({
                name: s.name,
                proficiency: s.proficiency,
                verified: s.verified,
            })),
            projects: (profile?.projects || []).map((p) => ({
                title: p.title,
                description: p.description || '',
                technologies: p.technologies || [],
            })),
            applications: applications.map((app) => {
                const job = app.job;
                return {
                    jobId: job?._id?.toString() || String(job || ''),
                    jobTitle: job?.title || 'Unknown Role',
                    companyName: job?.companyName || 'Unknown Company',
                    status: app.status,
                };
            }),
            interviews: interviews.map((int) => {
                const job = int.job;
                return {
                    jobTitle: job?.title || 'Unknown Role',
                    type: int.type,
                    status: int.status,
                    score: int.score,
                };
            }),
        };
    }
}
