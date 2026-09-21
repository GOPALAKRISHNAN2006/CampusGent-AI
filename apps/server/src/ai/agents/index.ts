import { IAgent, AgentMetadata, StudentIntelligenceSnapshot } from '../types';
import { PromptRegistry } from '../prompt.registry';
import { AIService } from '../../services/ai.service';
import { AIOrchestrator } from '../orchestrator';
import { PlacementAnalyticsService } from '../../services/placement-analytics.service';
import { Job } from '../../models/Job';
import { JobMatchingService } from '../../services/job-matching.service';
import { StudentProfile } from '../../models/StudentProfile';
import { AIInsight } from '../../models/AIInsight';
import { MockInterviewSession } from '../../models/MockInterviewSession';
import { AuditLog } from '../../models/AuditLog';
import { Notification } from '../../models/Notification';
import { Department } from '../../models/Department';
import { Types } from 'mongoose';

// Helper to auto-generate standard executions
const generateAgentCompletion = async (
  agentName: string,
  studentId: string,
  snapshot: StudentIntelligenceSnapshot,
  customParams?: any
) => {
  const { system } = PromptRegistry.getPrompt(agentName);
  const userPrompt = `
    Student Snapshot context:
    ${JSON.stringify(snapshot, null, 2)}
    
    Custom parameters details:
    ${JSON.stringify(customParams || {}, null, 2)}
  `;
  return AIService.generateCompletion(studentId, agentName as any, system, userPrompt);
};

// 1. Student Success Agent
export class StudentSuccessAgent implements IAgent {
  public metadata: AgentMetadata = {
    name: 'student_success',
    version: '1.0.0',
    description: 'Analyzes student grades and attendance metrics.',
    permissions: ['ai:academic'],
    promptVersion: '1.0.0',
  };
  public async execute(snapshot: StudentIntelligenceSnapshot) {
    return generateAgentCompletion(this.metadata.name, snapshot.studentId, snapshot);
  }
}

// 2. Placement Readiness Agent
export class PlacementReadinessAgent implements IAgent {
  public metadata: AgentMetadata = {
    name: 'placement_readiness',
    version: '1.0.0',
    description: 'Calculates active corporate eligibility and preparation yields.',
    permissions: ['ai:placement'],
    promptVersion: '1.0.0',
  };
  public async execute(snapshot: StudentIntelligenceSnapshot) {
    return generateAgentCompletion(this.metadata.name, snapshot.studentId, snapshot);
  }
}

// 3. Learning Path Agent
export class LearningPathAgent implements IAgent {
  public metadata: AgentMetadata = {
    name: 'learning_path',
    version: '1.0.0',
    description: 'Maps professional developmental targets to quarters.',
    permissions: ['ai:learning'],
    promptVersion: '1.0.0',
  };
  public async execute(snapshot: StudentIntelligenceSnapshot) {
    return generateAgentCompletion(this.metadata.name, snapshot.studentId, snapshot);
  }
}

// 4. Faculty Insights Agent
export class FacultyInsightsAgent implements IAgent {
  public metadata: AgentMetadata = {
    name: 'faculty_insights',
    version: '1.0.0',
    description: 'Compiles risk alerts summaries for assigned mentors.',
    permissions: ['ai:faculty'],
    promptVersion: '1.0.0',
  };
  public async execute(snapshot: StudentIntelligenceSnapshot) {
    return generateAgentCompletion(this.metadata.name, snapshot.studentId, snapshot);
  }
}

// 5. Placement Analytics Agent (Institutional — deterministic stats + AI interpretation)
export class PlacementAnalyticsAgent implements IAgent {
  public metadata: AgentMetadata = {
    name: 'placement_analytics',
    version: '1.0.0',
    description: 'Institutional analytics: deterministic aggregate statistics interpreted by AI.',
    permissions: ['ai:placement', 'ai:admin'],
    promptVersion: '1.0.0',
  };
  public async execute(snapshot: StudentIntelligenceSnapshot, customParams?: any) {
    // 1. Compute verified deterministic statistics from the database
    const statistics = await PlacementAnalyticsService.computeStatistics();

    // 2. Build a prompt that passes ONLY verified numbers to the AI
    const { system } = PromptRegistry.getPrompt(this.metadata.name);
    const userPrompt = `
      IMPORTANT: The following statistics are VERIFIED from the database.
      You must ONLY interpret and analyze these numbers.
      Do NOT invent, estimate, or hallucinate any numbers beyond what is provided.
      Every insight must reference the specific statistic it is based on.

      Verified Placement Statistics:
      ${JSON.stringify(statistics, null, 2)}
    `;

    return AIService.generateCompletion(
      snapshot.studentId,
      this.metadata.name as any,
      system,
      userPrompt
    );
  }
}

// 6. Career Recommendation Agent
export class CareerRecommendationAgent implements IAgent {
  public metadata: AgentMetadata = {
    name: 'career_recommendation',
    version: '1.0.0',
    description: 'Recommends target corporate jobs matches.',
    permissions: ['ai:career'],
    promptVersion: '1.0.0',
  };
  public async execute(snapshot: StudentIntelligenceSnapshot, customParams?: any) {
    // Fetch active jobs from database
    const jobs = await Job.find({ status: 'ACTIVE' }).limit(10).lean();

    const { system } = PromptRegistry.getPrompt(this.metadata.name);
    const userPrompt = `
      Student Snapshot context:
      ${JSON.stringify(snapshot, null, 2)}
      
      Available active jobs in database (verified job data):
      ${JSON.stringify(jobs, null, 2)}

      Custom parameters details:
      ${JSON.stringify(customParams || {}, null, 2)}
    `;
    return AIService.generateCompletion(snapshot.studentId, this.metadata.name as any, system, userPrompt);
  }
}

// 7. Mock Interview Agent
export class MockInterviewAgent implements IAgent {
  public metadata: AgentMetadata = {
    name: 'mock_interview',
    version: '1.0.0',
    description: 'Simulates conversation practice routines.',
    permissions: ['ai:interview'],
    promptVersion: '1.0.0',
  };
  public async execute(snapshot: StudentIntelligenceSnapshot, customParams?: any) {
    const { system } = PromptRegistry.getPrompt(this.metadata.name);
    
    // Enforce isolation XML boundary wrapper to prevent student-injected commands execution
    const userPrompt = `
      Student Snapshot context:
      ${JSON.stringify(snapshot, null, 2)}
      
      Mock Interview Request Parameter Mode:
      ${customParams?.mode || 'question'}
      
      Interview type:
      ${customParams?.type || 'TECHNICAL'}
      
      Job target ID:
      ${customParams?.jobId || 'N/A'}
      
      Question text:
      ${customParams?.question || 'N/A'}
      
      History of turns:
      ${JSON.stringify(customParams?.history || [], null, 2)}
      
      <student_input>
      ${customParams?.answer || ''}
      </student_input>
    `;
    return AIService.generateCompletion(snapshot.studentId, this.metadata.name as any, system, userPrompt);
  }
}

// 8. Resume Intelligence Agent
export class ResumeIntelligenceAgent implements IAgent {
  public metadata: AgentMetadata = {
    name: 'resume_intelligence',
    version: '1.0.0',
    description: 'Evaluates format structural compatibility scores.',
    permissions: ['ai:resume'],
    promptVersion: '1.0.0',
  };

  /**
   * Deterministic ATS section check — no AI involvement.
   * Returns a structured object of what sections are present/missing.
   */
  private runDeterministicAtsChecks(resumeText: string): {
    hasEducation: boolean;
    hasSkills: boolean;
    hasProjects: boolean;
    hasExperience: boolean;
    hasCertifications: boolean;
    hasSummary: boolean;
    sectionScore: number;
  } {
    const lower = resumeText.toLowerCase();
    const hasEducation = /education|degree|university|college|bachelor|master|b\.tech|m\.tech/.test(lower);
    const hasSkills = /skills|technologies|tools|languages|frameworks/.test(lower);
    const hasProjects = /project|built|developed|implemented|created/.test(lower);
    const hasExperience = /experience|internship|work|employment|position/.test(lower);
    const hasCertifications = /certif|award|achievement|license/.test(lower);
    const hasSummary = /summary|objective|about|profile/.test(lower);

    const presentCount = [hasEducation, hasSkills, hasProjects, hasExperience, hasCertifications, hasSummary]
      .filter(Boolean).length;
    const sectionScore = Math.round((presentCount / 6) * 100);

    return { hasEducation, hasSkills, hasProjects, hasExperience, hasCertifications, hasSummary, sectionScore };
  }

  public async execute(snapshot: StudentIntelligenceSnapshot, customParams?: any) {
    const { system } = PromptRegistry.getPrompt(this.metadata.name);

    // Sanitize raw resume content to strip any injected instructions
    const rawResume: string = customParams?.resumeContent || '';
    const sanitizedResume = rawResume.replace(/<[^>]*>/g, '').trim();

    // Run deterministic ATS section checks (no AI)
    const atsChecks = this.runDeterministicAtsChecks(sanitizedResume);

    // Build verified info from database snapshot — never from AI
    const verifiedSkills = (snapshot.skills || []).map((s: any) => s.name || s);
    const verifiedProjects = (snapshot.projects || []).map((p: any) => p.title || p);

    const userPrompt = `
      VERIFIED information from database (do NOT modify or contradict this):
      - Skills: ${JSON.stringify(verifiedSkills)}
      - Projects: ${JSON.stringify(verifiedProjects)}

      Deterministic ATS section checks (computed by backend, do NOT override):
      ${JSON.stringify(atsChecks, null, 2)}

      <resume_content>
      ${sanitizedResume || 'No resume content provided.'}
      </resume_content>

      Job target ID (if any): ${customParams?.jobId || 'N/A'}

      Student snapshot context:
      ${JSON.stringify({
        academic: snapshot.academic,
        skills: verifiedSkills,
        projects: verifiedProjects,
      }, null, 2)}
    `;

    return AIService.generateCompletion(
      snapshot.studentId,
      this.metadata.name as any,
      system,
      userPrompt
    );
  }
}

// 9. Job Matching Agent
export class JobMatchingAgent implements IAgent {
  public metadata: AgentMetadata = {
    name: 'job_matching',
    version: '1.0.0',
    description: 'Compares vacancy qualifications requirements parameters.',
    permissions: ['ai:jobs'],
    promptVersion: '1.0.0',
  };

  public async execute(snapshot: StudentIntelligenceSnapshot, customParams?: any) {
    const { system } = PromptRegistry.getPrompt(this.metadata.name);

    // Fetch profile to get department and placementReadinessScore
    const profile = await StudentProfile.findOne({ user: snapshot.studentId }).lean();
    
    // Extract verified student data from snapshot
    const studentSkills = (snapshot.skills || []).map((s: any) => s.name || String(s));
    const studentData = {
      cgpa: snapshot.academic?.cgpa ?? 0,
      backlogs: snapshot.academic?.backlogs ?? 0,
      department: profile?.department?.toString() ?? '',
      skills: studentSkills,
    };

    // --- DETERMINISTIC LAYER (AI cannot override) ---
    let deterministicMatches;
    if (customParams?.jobId) {
      // Match against a specific job
      const result = await JobMatchingService.computeForJob(customParams.jobId, studentData);
      deterministicMatches = [result];
    } else {
      // Find top matching active jobs
      deterministicMatches = await JobMatchingService.findTopMatches(studentData, 5);
    }

    // --- AI SEMANTIC LAYER ---
    const userPrompt = `
      The following DETERMINISTIC ELIGIBILITY and SKILL MATCH results were computed by the backend.
      You MUST preserve all eligible, eligibilityReasons, failedChecks, matchingSkills, missingSkills,
      and skillMatchPercent fields EXACTLY as provided below.
      Do NOT override hard constraint results.

      Deterministic Match Results:
      ${JSON.stringify(deterministicMatches, null, 2)}

      Student context:
      - Career goals: ${JSON.stringify(profile?.careerGoals || [])}
      - Projects: ${JSON.stringify((snapshot.projects || []).map((p: any) => p.title || p))}
      - Certifications: ${JSON.stringify((profile?.certifications || []).map((s: any) => s.name || s))}
      - Placement readiness score: ${profile?.placementReadinessScore ?? 'N/A'}

      For each job match, add:
      - matchScore (0-100, holistic semantic fit)
      - strengths (based only on verified data above)
      - weaknesses (based only on verified data above)
      - preparationRecommendations
      - explanation (clear, explainable reasoning)
    `;

    return AIService.generateCompletion(
      snapshot.studentId,
      this.metadata.name as any,
      system,
      userPrompt
    );
  }
}

// 10. Application Strategy Agent
export class ApplicationStrategyAgent implements IAgent {
  public metadata: AgentMetadata = {
    name: 'application_strategy',
    version: '1.0.0',
    description: 'Helps students prioritize application focus.',
    permissions: ['ai:strategy'],
    promptVersion: '1.0.0',
  };

  public async execute(snapshot: StudentIntelligenceSnapshot, customParams?: any) {
    const { system } = PromptRegistry.getPrompt(this.metadata.name);

    // Fetch student profile for department, placementReadinessScore, goals
    const profile = await StudentProfile.findOne({ user: snapshot.studentId }).lean();

    const studentSkills = (snapshot.skills || []).map((s: any) => s.name || String(s));
    const studentData = {
      cgpa: snapshot.academic?.cgpa ?? 0,
      backlogs: snapshot.academic?.backlogs ?? 0,
      department: profile?.department?.toString() ?? '',
      skills: studentSkills,
    };

    // Reuse deterministic matching logic
    const deterministicMatches = await JobMatchingService.findTopMatches(studentData, 5);

    const userPrompt = `
      You are generating a personalized application strategy.
      Here is the input context to analyze.

      Placement Readiness Score: ${profile?.placementReadinessScore ?? 0}/100
      Career goals: ${JSON.stringify(profile?.careerGoals || [])}
      Career interests: ${JSON.stringify(profile?.careerInterests || [])}

      Current Application Statuses (Jobs student already applied to):
      ${JSON.stringify(snapshot.applications || [], null, 2)}

      Student Mock Interview History:
      ${JSON.stringify(snapshot.interviews || [], null, 2)}

      Deterministic Job Matches & Eligibility Details:
      ${JSON.stringify(deterministicMatches, null, 2)}

      Please prioritize these jobs into High, Medium, and Low priority groups, suggesting prep plans, resume updates, and interview topics.
      DO NOT recommend automatic applications. Every application must require explicit student action.
    `;

    return AIService.generateCompletion(
      snapshot.studentId,
      this.metadata.name as any,
      system,
      userPrompt
    );
  }
}

// 11. Skill Gap Agent
export class SkillGapAgent implements IAgent {
  public metadata: AgentMetadata = {
    name: 'skill_gap',
    version: '1.0.0',
    description: 'Identifies student vs job criteria skill gaps.',
    permissions: ['ai:skills'],
    promptVersion: '1.0.0',
  };

  public async execute(snapshot: StudentIntelligenceSnapshot, customParams?: any) {
    const { system } = PromptRegistry.getPrompt(this.metadata.name);

    // Fetch StudentProfile to obtain full skills list, projects, and certifications
    const profile = await StudentProfile.findOne({ user: snapshot.studentId }).lean();

    // Student skills directly from database (with verified flag)
    const skillsList = profile?.skills || [];

    // Projects technologies
    const projectTechs = new Set<string>();
    if (profile?.projects) {
      for (const p of profile.projects) {
        if (p.technologies) {
          p.technologies.forEach((t: string) => projectTechs.add(t.toLowerCase().trim()));
        }
      }
    }

    // Certifications names
    const certNames = (profile?.certifications || []).map((c: any) => c.name);

    // If jobId is provided, retrieve its required skills
    let targetJobSkills: string[] = [];
    let jobDetails = null;
    if (customParams?.jobId) {
      const job = await Job.findById(customParams.jobId).lean();
      if (job) {
        targetJobSkills = job.requiredSkills || [];
        jobDetails = {
          title: job.title,
          companyName: job.companyName,
          requiredSkills: job.requiredSkills
        };
      }
    }

    const userPrompt = `
      You are running a skill gap analysis for a student.

      Student Profile Skills (database records):
      ${JSON.stringify(skillsList, null, 2)}

      Technologies used in Student Projects:
      ${JSON.stringify(Array.from(projectTechs), null, 2)}

      Student Certifications:
      ${JSON.stringify(certNames, null, 2)}

      Target Career Goals:
      ${JSON.stringify(profile?.careerGoals || [])}
      Target Career Interests:
      ${JSON.stringify(profile?.careerInterests || [])}

      Target Job Details (if any):
      ${JSON.stringify(jobDetails, null, 2)}

      Compare these inputs. For the skill breakdown:
      - Classify as DECLARED if skill is listed in profile but NOT verified and NOT in project/certification.
      - Classify as VERIFIED if skill has verified: true in database.
      - Classify as DEMONSTRATED if skill is actively used in projects or has certifications.
      - Classify as MISSING_EVIDENCE if the target career or job requires it but it is absent from the student's profile.
    `;

    return AIService.generateCompletion(
      snapshot.studentId,
      this.metadata.name as any,
      system,
      userPrompt
    );
  }
}

// 12. Career Growth Agent
export class CareerGrowthAgent implements IAgent {
  public metadata: AgentMetadata = {
    name: 'career_growth',
    version: '1.0.0',
    description: 'Tracks long-term career roadmaps.',
    permissions: ['ai:career'],
    promptVersion: '1.0.0',
  };

  public async execute(snapshot: StudentIntelligenceSnapshot, customParams?: any) {
    const { system } = PromptRegistry.getPrompt(this.metadata.name);

    // Fetch full student profile
    const profile = await StudentProfile.findOne({ user: snapshot.studentId }).lean();

    // Fetch historical AI insights — last 10 runs across all agents
    const historicalInsights = await AIInsight.find({ user: snapshot.studentId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Fetch mock interview history for interview events
    const interviewSessions = await MockInterviewSession.find({ student: snapshot.studentId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Build timeline events from verified data sources only
    const timelineEvents: Array<{ period: string; event: string; category: string; source: string }> = [];

    // Skills added (from profile)
    for (const skill of (profile?.skills || [])) {
      timelineEvents.push({
        period: 'Profile',
        event: `Added skill: ${skill.name} (${skill.proficiency})${skill.verified ? ' — Verified' : ''}`,
        category: 'SKILL',
        source: 'profile_skills',
      });
    }

    // Projects (from profile)
    for (const proj of (profile?.projects || [])) {
      timelineEvents.push({
        period: 'Project',
        event: `Completed project: ${proj.title}${proj.technologies?.length ? ` using ${proj.technologies.slice(0, 3).join(', ')}` : ''}`,
        category: 'PROJECT',
        source: 'profile_projects',
      });
    }

    // Certifications (from profile)
    for (const cert of (profile?.certifications || [])) {
      const period = cert.issueDate ? new Date(cert.issueDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Unknown';
      timelineEvents.push({
        period,
        event: `Earned certification: ${cert.name} from ${cert.issuingOrg}`,
        category: 'CERTIFICATION',
        source: 'profile_certifications',
      });
    }

    // Mock interviews (from DB)
    for (const session of interviewSessions) {
      if (session.status === 'COMPLETED') {
        const date = new Date((session as any).createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
        timelineEvents.push({
          period: date,
          event: `Completed ${session.type} mock interview`,
          category: 'INTERVIEW',
          source: 'mock_interview_session',
        });
      }
    }

    // Job applications from snapshot
    for (const app of (snapshot.applications || [])) {
      timelineEvents.push({
        period: 'Recent',
        event: `Applied to: ${app.jobTitle} at ${app.companyName} (${app.status})`,
        category: 'APPLICATION',
        source: 'applications',
      });
    }

    // Academic context
    timelineEvents.push({
      period: `Semester ${snapshot.academic?.semester ?? 'N/A'}`,
      event: `Current CGPA: ${snapshot.academic?.cgpa ?? 'N/A'}, Attendance: ${snapshot.academic?.attendance ?? 'N/A'}%`,
      category: 'ACADEMIC',
      source: 'academic_snapshot',
    });

    const userPrompt = `
      Generate a career growth analysis for this student.

      Student Profile Summary:
      - Semester: ${profile ? `Semester ${snapshot.academic?.semester}` : 'Unknown'}
      - CGPA: ${snapshot.academic?.cgpa ?? 0}
      - Skills: ${(profile?.skills || []).length} skills (${(profile?.skills || []).filter((s: any) => s.verified).length} verified)
      - Projects: ${(profile?.projects || []).length}
      - Certifications: ${(profile?.certifications || []).length}
      - Career Goals: ${JSON.stringify(profile?.careerGoals || [])}
      - Career Interests: ${JSON.stringify(profile?.careerInterests || [])}
      - Placement Readiness Score: ${profile?.placementReadinessScore ?? 0}/100
      - Applications submitted: ${snapshot.applications?.length ?? 0}
      - Mock interviews completed: ${interviewSessions.filter(s => s.status === 'COMPLETED').length}

      Verified timeline events (from database — do NOT add events not present here):
      ${JSON.stringify(timelineEvents, null, 2)}

      Historical AI Insights (previous agent runs):
      ${JSON.stringify(historicalInsights.map(i => ({ agent: i.agent, generatedAt: i.generatedAt, status: i.status })), null, 2)}
    `;

    return AIService.generateCompletion(
      snapshot.studentId,
      this.metadata.name as any,
      system,
      userPrompt
    );
  }
}

// 13. Student Risk Agent
export class StudentRiskAgent implements IAgent {
  public metadata: AgentMetadata = {
    name: 'student_risk',
    version: '1.0.0',
    description: 'Predicts early warning academic and behavioral risk factors.',
    permissions: ['ai:risk'],
    promptVersion: '1.0.0',
  };

  public async execute(snapshot: StudentIntelligenceSnapshot, customParams?: any) {
    const { system } = PromptRegistry.getPrompt(this.metadata.name);

    // Fetch full student profile to check resume completeness and details
    const profile = await StudentProfile.findOne({ user: snapshot.studentId }).lean();

    // Query mock interview history for this student
    const interviewSessions = await MockInterviewSession.find({ student: snapshot.studentId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Gather specific inputs (observable performance signals)
    const userPrompt = `
      Analyze the risk factors for this student.

      Student Academic & Behavioral Signals:
      - Attendance: ${snapshot.academic?.attendance ?? 'N/A'}%
      - CGPA: ${snapshot.academic?.cgpa ?? 0}
      - Backlogs: ${snapshot.academic?.backlogs ?? 0}
      - Placement Readiness Score: ${profile?.placementReadinessScore ?? 0}/100
      - Skills: ${(profile?.skills || []).map((s: any) => `${s.name} (${s.proficiency}, ${s.verified ? 'Verified' : 'Declared'})`).join(', ')}
      - Resume: ${profile?.resumeUrl ? 'Uploaded' : 'Missing / Incomplete'}
      - Projects Count: ${(profile?.projects || []).length}
      - Certifications Count: ${(profile?.certifications || []).length}
      - Mock Interviews Completed: ${interviewSessions.filter(s => s.status === 'COMPLETED').length}
      - Recent Interview Feedback: ${JSON.stringify(interviewSessions.map(s => ({ type: s.type, score: s.overallScore, feedback: s.overallFeedback })))}
    `;

    const output = await AIService.generateCompletion(
      snapshot.studentId,
      this.metadata.name as any,
      system,
      userPrompt
    );

    // Add Audit Log
    try {
      await AuditLog.create({
        user: new Types.ObjectId(snapshot.studentId),
        action: 'STUDENT_RISK_ASSESSMENT',
        details: {
          riskIndicator: output.riskIndicator,
          severity: output.severity,
          confidence: output.confidence,
          recommendedHumanIntervention: output.recommendedHumanIntervention,
          evidence: output.evidence,
          isAIAssisted: output.isAIAssisted
        }
      });
    } catch (e) {
      console.error('Failed to create AuditLog for student risk prediction:', e);
    }

    return output;
  }
}

// 14. Opportunity Agent
export class OpportunityAgent implements IAgent {
  public metadata: AgentMetadata = {
    name: 'opportunity',
    version: '1.0.0',
    description: 'Identifies open hackathons matching profiles.',
    permissions: ['ai:opportunity'],
    promptVersion: '1.0.0',
  };
  public async execute(snapshot: StudentIntelligenceSnapshot) {
    return generateAgentCompletion(this.metadata.name, snapshot.studentId, snapshot);
  }
}

// 15. Student Engagement Agent
export class StudentEngagementAgent implements IAgent {
  public metadata: AgentMetadata = {
    name: 'student_engagement',
    version: '1.0.0',
    description: 'Provides early notifications and reminders to maintain student path progress.',
    permissions: ['ai:engagement'],
    promptVersion: '1.0.0',
  };

  public async execute(snapshot: StudentIntelligenceSnapshot, customParams?: any) {
    const { system } = PromptRegistry.getPrompt(this.metadata.name);

    // Fetch full student profile
    const profile = await StudentProfile.findOne({ user: snapshot.studentId }).lean();

    // Query mock interview history for this student
    const interviewSessions = await MockInterviewSession.find({ student: snapshot.studentId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const userPrompt = `
      Analyze this student's platform activity and determine if a highly meaningful reminder/alert is needed.

      Student Context:
      - CGPA: ${snapshot.academic?.cgpa ?? 0}
      - Attendance: ${snapshot.academic?.attendance ?? 'N/A'}%
      - Placement Readiness Score: ${profile?.placementReadinessScore ?? 0}/100
      - Skills registered: ${(profile?.skills || []).length} (${(profile?.skills || []).filter((s: any) => s.verified).length} verified)
      - Projects registered: ${(profile?.projects || []).length}
      - Resume: ${profile?.resumeUrl ? 'Uploaded' : 'Missing / Incomplete'}
      - Mock interviews completed: ${interviewSessions.filter(s => s.status === 'COMPLETED').length}
      - Applications submitted: ${snapshot.applications?.length ?? 0}
    `;

    const output = await AIService.generateCompletion(
      snapshot.studentId,
      this.metadata.name as any,
      system,
      userPrompt
    );

    // Save Notifications if meaningfulAlert is true and there are alerts
    if (output.meaningfulAlert && output.alerts && output.alerts.length > 0) {
      try {
        for (const alert of output.alerts) {
          await Notification.create({
            recipient: new Types.ObjectId(snapshot.studentId),
            type: alert.type || 'system',
            title: alert.title,
            message: alert.message,
            read: false,
          });
        }
      } catch (e) {
        console.error('Failed to create Notifications inside StudentEngagementAgent:', e);
      }
    }

    return output;
  }
}

// 16. Placement Preparation Agent (Coordinator — reads cached insights from peer agents)
export class PlacementPreparationAgent implements IAgent {
  public metadata: AgentMetadata = {
    name: 'placement_preparation',
    version: '1.0.0',
    description: 'Coordinates peer-agent outputs into a personalised preparation plan. Does not recalculate data.',
    permissions: ['ai:placement'],
    promptVersion: '1.0.0',
  };

  public async execute(snapshot: StudentIntelligenceSnapshot, customParams?: any) {
    const { system } = PromptRegistry.getPrompt(this.metadata.name);

    // --- 1. Read the most recent AIInsight from each peer agent (no recalculation) ---
    const peerAgents = [
      'skill_gap',
      'resume_intelligence',
      'job_matching',
      'placement_readiness',
      'mock_interview',
      'learning_path',
    ];

    const peerInsights: Record<string, any> = {};
    for (const agentName of peerAgents) {
      const record = await AIInsight.findOne({
        studentId: snapshot.studentId,
        agent: agentName,
        status: 'ACTIVE',
      })
        .sort({ generatedAt: -1 })
        .lean();

      if (record) {
        peerInsights[agentName] = record.insight;
      }
    }

    // --- 2. Extract key metrics without duplicating logic ---
    const skillGap = peerInsights['skill_gap'] || {};
    const resumeIntel = peerInsights['resume_intelligence'] || {};
    const jobMatching = peerInsights['job_matching'] || {};
    const readiness = peerInsights['placement_readiness'] || {};
    const mockInterview = peerInsights['mock_interview'] || {};
    const learningPath = peerInsights['learning_path'] || {};

    // Profile for application/interview counts
    const profile = await StudentProfile.findOne({ user: snapshot.studentId }).lean();
    const completedMockInterviews = await MockInterviewSession.countDocuments({
      student: snapshot.studentId,
      status: 'COMPLETED',
    });

    const sourceSummary = {
      placementReadinessScore: readiness.readinessScore ?? profile?.placementReadinessScore ?? 0,
      criticalSkillGaps: skillGap.criticalGaps ?? [],
      resumeScore: resumeIntel.atsAnalysis?.score ?? resumeIntel.score ?? null,
      openApplications: snapshot.applications?.filter((a) => a.status !== 'REJECTED').length ?? 0,
      completedMockInterviews,
    };

    // --- 3. Build a context-rich prompt using verified peer data ---
    const userPrompt = `
      Generate a personalised placement preparation plan for this student.
      All values below are VERIFIED outputs from specialised peer agents — do NOT recalculate them.

      === VERIFIED PEER-AGENT DATA ===

      [Placement Readiness]
      - Readiness score: ${sourceSummary.placementReadinessScore}/100
      - Strong areas: ${JSON.stringify(readiness.strongAreas ?? [])}
      - Weak areas: ${JSON.stringify(readiness.weakAreas ?? [])}

      [Skill Gap Analysis]
      - Critical gaps: ${JSON.stringify(skillGap.criticalGaps ?? [])}
      - Important gaps: ${JSON.stringify(skillGap.importantGaps ?? [])}
      - Existing strengths: ${JSON.stringify(skillGap.existingStrengths ?? [])}

      [Resume Intelligence]
      - ATS score: ${sourceSummary.resumeScore ?? 'Not yet analysed'}
      - Resume tasks pending: ${JSON.stringify(resumeIntel.aiSuggestions?.tailoringSuggestions ?? [])}

      [Job Matching]
      - Eligible job matches: ${JSON.stringify((jobMatching.matches ?? []).filter((m: any) => m.eligible).map((m: any) => ({ title: m.jobTitle, company: m.companyName, score: m.matchScore })))}
      - High-priority jobs: ${JSON.stringify(jobMatching.highPriorityJobs ?? [])}

      [Mock Interviews]
      - Completed sessions: ${completedMockInterviews}
      - Interview areas to focus on: ${JSON.stringify(mockInterview.followUpTopics ?? [])}

      [Learning Path]
      - Recommended sequence: ${JSON.stringify(learningPath.recommendedSequence ?? [])}
      - Learning modules: ${JSON.stringify((learningPath.learningModules ?? []).map((m: any) => m.moduleTitle))}

      [Student Applications]
      - Open applications: ${sourceSummary.openApplications}

      === SOURCE SUMMARY ===
      ${JSON.stringify(sourceSummary, null, 2)}

      Using only the data above, produce a concrete 4-week preparation roadmap.
    `;

    return AIService.generateCompletion(
      snapshot.studentId,
      this.metadata.name as any,
      system,
      userPrompt
    );
  }
}

// 17. Faculty Intervention Agent
export class FacultyInterventionAgent implements IAgent {
  public metadata: AgentMetadata = {
    name: 'faculty_intervention',
    version: '1.0.0',
    description: 'Suggests specific, evidence-backed support actions for mentors/instructors.',
    permissions: ['ai:faculty'],
    promptVersion: '1.0.0',
  };

  public async execute(snapshot: StudentIntelligenceSnapshot, customParams?: any) {
    const { system } = PromptRegistry.getPrompt(this.metadata.name);

    // Fetch student profile details
    const profile = await StudentProfile.findOne({ user: snapshot.studentId }).populate('user', 'name').lean();
    const studentName = (profile?.user as any)?.name || 'Student';

    // Query recent mock interview performance
    const interviewSessions = await MockInterviewSession.find({ student: snapshot.studentId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const userPrompt = `
      Identify student intervention and mentoring opportunities for ${studentName} (ID: ${snapshot.studentId}).

      Observable Student Metrics & Context:
      - CGPA: ${snapshot.academic?.cgpa ?? 0}
      - Attendance Rate: ${snapshot.academic?.attendance ?? 0}%
      - Semester: ${snapshot.academic?.semester ?? 1}
      - Backlogs count: ${snapshot.academic?.backlogs ?? 0}
      - Placement Readiness Score: ${profile?.placementReadinessScore ?? 0}/100
      - Skills: ${(profile?.skills || []).map((s: any) => `${s.name} (${s.proficiency}, ${s.verified ? 'Verified' : 'Declared'})`).join(', ')}
      - Resume: ${profile?.resumeUrl ? 'Uploaded' : 'Missing / Incomplete'}
      - Projects Count: ${(profile?.projects || []).length}
      - Completed Mock Interviews: ${interviewSessions.filter(s => s.status === 'COMPLETED').length}
      - Recent Interview Scores: ${JSON.stringify(interviewSessions.map(s => ({ score: s.overallScore, feedback: s.overallFeedback })))}
      - Active applications: ${snapshot.applications?.length ?? 0}
    `;

    return AIService.generateCompletion(
      snapshot.studentId,
      this.metadata.name as any,
      system,
      userPrompt
    );
  }
}

// 18. Placement Officer Copilot
export class PlacementOfficerCopilot implements IAgent {
  public metadata: AgentMetadata = {
    name: 'placement_officer_copilot',
    version: '1.0.0',
    description: 'Provides recruiter overview statistics summaries and answers natural language placement queries.',
    permissions: ['ai:placement'],
    promptVersion: '1.0.0',
  };

  public async execute(snapshot: StudentIntelligenceSnapshot, customParams?: any) {
    const { system } = PromptRegistry.getPrompt(this.metadata.name);
    const query = customParams?.query || 'Show placement overview statistics';

    // 1. Fetch deterministic statistical aggregates
    const stats = await PlacementAnalyticsService.computeStatistics();

    // 2. Fetch all student profiles with names and skills for query filtering
    const students = await StudentProfile.find({})
      .populate('user', 'name')
      .lean();
    const studentsSummary = students.map((s) => ({
      id: s.user?._id?.toString() || s._id.toString(),
      name: (s.user as any)?.name || 'Unknown student',
      cgpa: s.cgpa || 0,
      department: s.department?.toString() || 'Unknown',
      skills: (s.skills || []).map((sk) => `${sk.name} (${sk.proficiency}, ${sk.verified ? 'Verified' : 'Declared'})`),
      placementReadinessScore: s.placementReadinessScore || 0,
      resumeUrl: s.resumeUrl ? 'Uploaded' : 'Missing',
    }));

    // 3. Fetch active job listings
    const activeJobs = await Job.find({ status: 'ACTIVE' }).lean();
    const jobsSummary = activeJobs.map((j) => ({
      title: j.title,
      company: j.companyName,
      requiredSkills: j.requiredSkills || [],
      minCgpa: j.eligibilityCriteria?.minCgpa || 0,
    }));

    const userPrompt = `
      Answer this Placement Officer query: "${query}"

      === VERIFIED DETERMINISTIC STATISTICAL AGGREGATES ===
      - Total Students registered: ${stats.totalStudents}
      - Avg CGPA: ${stats.averageCgpa}
      - Avg Placement Readiness Score: ${stats.averagePlacementReadinessScore}/100
      - Department-wise student counts: ${JSON.stringify(stats.departmentBreakdown)}
      - Active Jobs in system: ${stats.activeJobs} (across ${stats.totalCompanies} unique companies)
      - Top Skills Demanded by recruiters: ${JSON.stringify(stats.topSkillsDemanded)}
      - Top Job Roles: ${JSON.stringify(stats.roleDistribution)}
      - Application Funnel stats: ${JSON.stringify(stats.applicationsByStatus)}
      - Interview Funnel stats: ${JSON.stringify(stats.interviewsByStatus)}
      - Avg Interview Score: ${stats.averageInterviewScore}/100

      === SYSTEM STUDENTS REGISTERED ===
      ${JSON.stringify(studentsSummary, null, 2)}

      === SYSTEM ACTIVE JOB POSTINGS ===
      ${JSON.stringify(jobsSummary, null, 2)}
    `;

    return AIService.generateCompletion(
      snapshot.studentId,
      this.metadata.name as any,
      system,
      userPrompt
    );
  }
}

// 19. Admin Intelligence Agent
export class AdminIntelligenceAgent implements IAgent {
  public metadata: AgentMetadata = {
    name: 'admin_intelligence',
    version: '1.0.0',
    description: 'Monitors system health and AI cost data metrics.',
    permissions: ['ai:admin'],
    promptVersion: '1.0.0',
  };
  public async execute(snapshot: StudentIntelligenceSnapshot) {
    return generateAgentCompletion(this.metadata.name, snapshot.studentId, snapshot);
  }
}

// 20. Data Quality Agent
export class DataQualityAgent implements IAgent {
  public metadata: AgentMetadata = {
    name: 'data_quality',
    version: '1.0.0',
    description: 'Monitors schema compliance and database data duplicates.',
    permissions: ['ai:admin'],
    promptVersion: '1.0.0',
  };

  public async execute(snapshot: StudentIntelligenceSnapshot, customParams?: any) {
    const { system } = PromptRegistry.getPrompt(this.metadata.name);

    // 1. Scan for raw database quality anomalies
    const anomalies: any[] = [];

    // Profiles scan
    const profiles = await StudentProfile.find({}).lean();
    const depts = await Department.find({}).lean();
    const deptIds = new Set(depts.map((d) => d._id.toString()));

    // Check duplicate student profiles per user
    const userProfileCount: Record<string, number> = {};
    for (const p of profiles) {
      if (p.user) {
        const userIdStr = p.user.toString();
        userProfileCount[userIdStr] = (userProfileCount[userIdStr] || 0) + 1;
      }
    }
    for (const [userId, count] of Object.entries(userProfileCount)) {
      if (count > 1) {
        anomalies.push({
          type: 'DUPLICATE_STUDENT',
          affectedRecord: `User ID: ${userId}`,
          evidence: `User is associated with ${count} StudentProfile documents.`,
        });
      }
    }

    // Check duplicates inside each profile, missing fields, or invalid refs
    for (const p of profiles) {
      const pIdStr = p._id.toString();

      // Duplicate skills check
      const skillNames = (p.skills || []).map((s: any) => s.name?.toLowerCase()?.trim());
      const uniqueSkillNames = new Set(skillNames);
      if (skillNames.length !== uniqueSkillNames.size) {
        anomalies.push({
          type: 'DUPLICATE_SKILLS',
          affectedRecord: `StudentProfile: ${pIdStr}`,
          evidence: `Skills array contains duplicate skill entries. Total skills: ${skillNames.length}, unique skills: ${uniqueSkillNames.size}`,
        });
      }

      // Invalid relationships
      if (p.department && !deptIds.has(p.department.toString())) {
        anomalies.push({
          type: 'INVALID_RELATIONSHIP',
          affectedRecord: `StudentProfile: ${pIdStr}`,
          evidence: `department references non-existent Department ID: ${p.department.toString()}`,
        });
      }

      // Missing required fields
      if (p.cgpa === undefined || p.cgpa === null) {
        anomalies.push({
          type: 'MISSING_FIELD',
          affectedRecord: `StudentProfile: ${pIdStr}`,
          evidence: 'Required academic field cgpa is undefined or null',
        });
      }

      // Conflicting academic data
      if (p.cgpa !== undefined && p.cgpa !== null && (p.cgpa > 10.0 || p.cgpa < 0.0)) {
        anomalies.push({
          type: 'CONFLICTING_ACADEMIC_DATA',
          affectedRecord: `StudentProfile: ${pIdStr}`,
          evidence: `cgpa value ${p.cgpa} is outside valid bounds [0.0, 10.0]`,
        });
      }

      // Invalid URLs
      if (p.resumeUrl && !p.resumeUrl.startsWith('http://') && !p.resumeUrl.startsWith('https://')) {
        anomalies.push({
          type: 'INVALID_URL',
          affectedRecord: `StudentProfile: ${pIdStr}`,
          evidence: `resumeUrl "${p.resumeUrl}" is not a valid HTTP/HTTPS link format`,
        });
      }

      // Incomplete profiles
      if (!p.resumeUrl || (p.skills || []).length === 0 || (p.projects || []).length === 0) {
        anomalies.push({
          type: 'INCOMPLETE_PROFILE',
          affectedRecord: `StudentProfile: ${pIdStr}`,
          evidence: `Profile contains missing details: ${!p.resumeUrl ? 'Missing Resume' : ''} ${p.skills?.length === 0 ? 'Missing Skills' : ''} ${p.projects?.length === 0 ? 'Missing Projects' : ''}`,
        });
      }
    }

    // Scan for stale insights
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const staleInsights = await AIInsight.find({
      status: 'ACTIVE',
      generatedAt: { $lt: thirtyDaysAgo },
    }).lean();

    for (const insight of staleInsights) {
      anomalies.push({
        type: 'STALE_INSIGHT',
        affectedRecord: `AIInsight ID: ${insight._id.toString()}`,
        evidence: `Insight generated on ${new Date(insight.generatedAt).toLocaleDateString()} is active but older than 30 days`,
      });
    }

    const userPrompt = `
      Assess the following database quality compliance anomalies.
      Map every raw anomaly into the required format (Type, Severity, Affected Record, Evidence, Suggested Correction).

      RAW DATABASE COMPLIANCE REPORTS:
      ${JSON.stringify(anomalies, null, 2)}
    `;

    return AIService.generateCompletion(
      snapshot.studentId,
      this.metadata.name as any,
      system,
      userPrompt
    );
  }
}

// 21. AI Governance Agent
export class AIGovernanceAgent implements IAgent {
  public metadata: AgentMetadata = {
    name: 'ai_governance',
    version: '1.0.0',
    description: 'Logs sensitive policy validations audits and compiles AI system health telemetry.',
    permissions: ['ai:admin'],
    promptVersion: '1.0.0',
  };

  public async execute(snapshot: StudentIntelligenceSnapshot, customParams?: any) {
    const { system } = PromptRegistry.getPrompt(this.metadata.name);

    // 1. Query telemetry audits from AuditLog
    const logs = await AuditLog.find({
      action: { $in: ['AI_EXECUTION', 'AI_FAILURE', 'AI_VALIDATION_FAILURE', 'AI_PROMPT_INJECTION_ATTEMPT'] }
    }).lean();

    let totalExecutions = 0;
    let latencySum = 0;
    let totalCostUsd = 0;
    let failuresCount = 0;
    let validationFailuresCount = 0;
    let injectionAttemptsCount = 0;
    const auditTrail: any[] = [];

    for (const log of logs) {
      const details: any = log.details || {};
      const timestampStr = log.createdAt ? new Date(log.createdAt).toISOString() : new Date().toISOString();

      if (log.action === 'AI_EXECUTION') {
        totalExecutions++;
        latencySum += details.latencyMs || 0;
        totalCostUsd += details.costUsd || 0;

        // Add important executions to audit trail
        if (details.feature !== 'ai_governance' && details.feature !== 'placement_officer_copilot') {
          auditTrail.push({
            timestamp: timestampStr,
            feature: details.feature || 'unknown',
            action: log.action,
            details: {
              latencyMs: details.latencyMs || 0,
              costUsd: details.costUsd || 0,
              modelUsed: details.modelUsed || 'unknown',
              agentVersion: details.agentVersion || '1.0.0',
            },
          });
        }
      } else if (log.action === 'AI_FAILURE') {
        failuresCount++;
        auditTrail.push({
          timestamp: timestampStr,
          feature: details.feature || 'unknown',
          action: log.action,
          details: { error: details.error || 'Connection failed' },
        });
      } else if (log.action === 'AI_VALIDATION_FAILURE') {
        validationFailuresCount++;
        auditTrail.push({
          timestamp: timestampStr,
          feature: details.feature || 'unknown',
          action: log.action,
          details: { error: details.error || 'Parsing failed' },
        });
      } else if (log.action === 'AI_PROMPT_INJECTION_ATTEMPT') {
        injectionAttemptsCount++;
        auditTrail.push({
          timestamp: timestampStr,
          feature: details.feature || 'unknown',
          action: log.action,
          details: { promptSnippet: details.promptSnippet || 'Blocked attempt' },
        });
      }
    }

    const averageLatencyMs = totalExecutions > 0 ? Math.round(latencySum / totalExecutions) : 0;

    // Scan for stale insights
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const staleInsightsCount = await AIInsight.countDocuments({
      status: 'ACTIVE',
      generatedAt: { $lt: thirtyDaysAgo },
    });

    const userPrompt = `
      Compile AI system governance audit report.

      === SYSTEM OPERATIONAL AGGREGATES ===
      - Total Executions tracked: ${totalExecutions}
      - Avg Latency: ${averageLatencyMs}ms
      - Cumulative AI Cost: $${totalCostUsd.toFixed(6)}
      - Network/API Failures: ${failuresCount}
      - Validation Parse Failures: ${validationFailuresCount}
      - Injection/Override Security Incidents: ${injectionAttemptsCount}
      - Stale Active Insights count: ${staleInsightsCount}

      === GOVERNMENT AUDIT TRAILS (LATEST EVENTS) ===
      ${JSON.stringify(auditTrail.slice(-20), null, 2)}
    `;

    return AIService.generateCompletion(
      snapshot.studentId,
      this.metadata.name as any,
      system,
      userPrompt
    );
  }
}

// 22. Custom Placement Agent
export class PlacementAgent implements IAgent {
  public metadata: AgentMetadata = {
    name: 'placement_agent',
    version: '1.0.0',
    description: 'Analyzes resume readiness matching.',
    permissions: ['ai:placement'],
    promptVersion: '1.0.0',
  };
  public async execute(snapshot: StudentIntelligenceSnapshot) {
    return generateAgentCompletion(this.metadata.name, snapshot.studentId, snapshot);
  }
}

// 23. Custom Attendance Agent
export class AttendanceAgent implements IAgent {
  public metadata: AgentMetadata = {
    name: 'attendance_agent',
    version: '1.0.0',
    description: 'Predicts risk students based on class attendance metrics.',
    permissions: ['ai:academic'],
    promptVersion: '1.0.0',
  };
  public async execute(snapshot: StudentIntelligenceSnapshot) {
    return generateAgentCompletion(this.metadata.name, snapshot.studentId, snapshot);
  }
}

// 24. Custom Query Agent
export class QueryAgent implements IAgent {
  public metadata: AgentMetadata = {
    name: 'query_agent',
    version: '1.0.0',
    description: 'Answers student academic questions based on context databases.',
    permissions: ['ai:advisor'],
    promptVersion: '1.0.0',
  };
  public async execute(snapshot: StudentIntelligenceSnapshot, customParams?: any) {
    return generateAgentCompletion(this.metadata.name, snapshot.studentId, snapshot, customParams);
  }
}

// 25. Custom Faculty Assistant Agent
export class FacultyAssistantAgent implements IAgent {
  public metadata: AgentMetadata = {
    name: 'faculty_assistant',
    version: '1.0.0',
    description: 'Generates workload and performance status reports for instructors.',
    permissions: ['ai:faculty'],
    promptVersion: '1.0.0',
  };
  public async execute(snapshot: StudentIntelligenceSnapshot) {
    return generateAgentCompletion(this.metadata.name, snapshot.studentId, snapshot);
  }
}

// Auto-register agents on initialization
export const initializeAgentEcosystem = () => {
  AIOrchestrator.registerAgent('student_success', new StudentSuccessAgent());
  AIOrchestrator.registerAgent('placement_readiness', new PlacementReadinessAgent());
  AIOrchestrator.registerAgent('learning_path', new LearningPathAgent());
  AIOrchestrator.registerAgent('faculty_insights', new FacultyInsightsAgent());
  AIOrchestrator.registerAgent('placement_analytics', new PlacementAnalyticsAgent());
  AIOrchestrator.registerAgent('career_recommendation', new CareerRecommendationAgent());
  AIOrchestrator.registerAgent('mock_interview', new MockInterviewAgent());
  AIOrchestrator.registerAgent('resume_intelligence', new ResumeIntelligenceAgent());
  AIOrchestrator.registerAgent('job_matching', new JobMatchingAgent());
  AIOrchestrator.registerAgent('application_strategy', new ApplicationStrategyAgent());
  AIOrchestrator.registerAgent('skill_gap', new SkillGapAgent());
  AIOrchestrator.registerAgent('career_growth', new CareerGrowthAgent());
  AIOrchestrator.registerAgent('student_risk', new StudentRiskAgent());
  AIOrchestrator.registerAgent('opportunity', new OpportunityAgent());
  AIOrchestrator.registerAgent('student_engagement', new StudentEngagementAgent());
  AIOrchestrator.registerAgent('placement_preparation', new PlacementPreparationAgent());
  AIOrchestrator.registerAgent('faculty_intervention', new FacultyInterventionAgent());
  AIOrchestrator.registerAgent('placement_officer_copilot', new PlacementOfficerCopilot());
  AIOrchestrator.registerAgent('admin_intelligence', new AdminIntelligenceAgent());
  AIOrchestrator.registerAgent('data_quality', new DataQualityAgent());
  AIOrchestrator.registerAgent('ai_governance', new AIGovernanceAgent());
  
  // Custom Accelerator Registry
  AIOrchestrator.registerAgent('placement_agent', new PlacementAgent());
  AIOrchestrator.registerAgent('attendance_agent', new AttendanceAgent());
  AIOrchestrator.registerAgent('query_agent', new QueryAgent());
  AIOrchestrator.registerAgent('faculty_assistant', new FacultyAssistantAgent());
};
