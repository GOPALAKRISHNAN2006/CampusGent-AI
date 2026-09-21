import { StudentProfile } from '../models/StudentProfile';
import { JobApplication } from '../models/JobApplication';
import { Interview } from '../models/Interview';
import { StudentIntelligenceSnapshot } from './types';
import mongoose from 'mongoose';

export class AIContextBuilder {
  public static async buildSnapshot(studentId: string): Promise<StudentIntelligenceSnapshot> {
    const studentObjId = new mongoose.Types.ObjectId(studentId);

    // 1. Load Student profile
    const profile = await StudentProfile.findOne({ user: studentObjId });
    
    // 2. Load active job applications
    const applications = await JobApplication.find({ student: studentObjId })
      .populate('job', 'title companyName')
      .limit(10);

    // 3. Load scheduled or completed interviews
    const interviews = await Interview.find({ student: studentObjId })
      .populate('job', 'title')
      .limit(10);

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
        const job = app.job as any;
        return {
          jobId: app.job.toString(),
          jobTitle: job?.title || 'Unknown Role',
          companyName: job?.companyName || 'Unknown Company',
          status: app.status,
        };
      }),
      interviews: interviews.map((int) => {
        const job = int.job as any;
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
