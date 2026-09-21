import { z } from 'zod';

// Roles Enum
export const UserRole = {
  STUDENT: 'STUDENT',
  FACULTY: 'FACULTY',
  PLACEMENT_OFFICER: 'PLACEMENT_OFFICER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];

// User Status Enum
export const UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PENDING_VERIFICATION: 'PENDING_VERIFICATION',
} as const;

export type UserStatusType = typeof UserStatus[keyof typeof UserStatus];

// Employment Types
export const EmploymentType = {
  FULL_TIME: 'FULL_TIME',
  PART_TIME: 'PART_TIME',
  INTERNSHIP: 'INTERNSHIP',
  CONTRACT: 'CONTRACT',
} as const;

export type EmploymentTypeType = typeof EmploymentType[keyof typeof EmploymentType];

// Job Status
export const JobStatus = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  CLOSED: 'CLOSED',
  ARCHIVED: 'ARCHIVED',
} as const;

export type JobStatusType = typeof JobStatus[keyof typeof JobStatus];

// Job Application Status
export const ApplicationStatus = {
  APPLIED: 'APPLIED',
  SCREENING: 'SCREENING',
  SHORTLISTED: 'SHORTLISTED',
  INTERVIEW: 'INTERVIEW',
  SELECTED: 'SELECTED',
  REJECTED: 'REJECTED',
  WITHDRAWN: 'WITHDRAWN',
} as const;

export type ApplicationStatusType = typeof ApplicationStatus[keyof typeof ApplicationStatus];

// --- Zod Validations ---

// Authentication
export const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.nativeEnum(UserRole).default(UserRole.STUDENT),
  department: z.string().optional(),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof LoginSchema>;

// Student Profile Updates
export const StudentProfileUpdateSchema = z.object({
  rollNumber: z.string().min(1, 'Roll number is required').optional(),
  semester: z.number().min(1).max(8),
  cgpa: z.number().min(0).max(10),
  skills: z.array(
    z.object({
      name: z.string().min(1),
      proficiency: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']),
    })
  ).optional(),
  projects: z.array(
    z.object({
      title: z.string().min(1),
      description: z.string(),
      technologies: z.array(z.string()),
      githubUrl: z.string().url().or(z.literal('')).optional(),
      demoUrl: z.string().url().or(z.literal('')).optional(),
    })
  ).optional(),
  certifications: z.array(
    z.object({
      name: z.string().min(1),
      issuingOrg: z.string(),
      issueDate: z.string(),
      credentialUrl: z.string().url().or(z.literal('')).optional(),
    })
  ).optional(),
  githubProfile: z.string().url().or(z.literal('')).optional(),
  linkedinProfile: z.string().url().or(z.literal('')).optional(),
  portfolioUrl: z.string().url().or(z.literal('')).optional(),
  careerInterests: z.array(z.string()).optional(),
  careerGoals: z.array(z.string()).optional(),
});

export type StudentProfileUpdateInput = z.infer<typeof StudentProfileUpdateSchema>;

// Jobs
export const JobCreateSchema = z.object({
  title: z.string().min(2, 'Job title is required'),
  companyName: z.string().min(2, 'Company name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(2, 'Location is required'),
  employmentType: z.nativeEnum(EmploymentType),
  salaryMin: z.number().nonnegative(),
  salaryMax: z.number().nonnegative(),
  requiredSkills: z.array(z.string()),
  experienceRequired: z.number().nonnegative(),
  minCgpa: z.number().min(0).max(10).default(0),
  allowedDepartments: z.array(z.string()),
  maxBacklogsAllowed: z.number().default(0),
  applicationDeadline: z.string(),
});

export type JobCreateInput = z.infer<typeof JobCreateSchema>;

// Student Success Agent Input/Output Schemas
export const StudentSuccessInputSchema = z.object({
  studentId: z.string().min(1, 'studentId is required'),
  customParams: z.record(z.any()).optional(),
});

export type StudentSuccessInput = z.infer<typeof StudentSuccessInputSchema>;

export const StudentSuccessOutputSchema = z.object({
  overallStatus: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  subjectsRequiringAttention: z.array(z.string()),
  academicRiskIndicators: z.array(z.string()),
  improvementRecommendations: z.array(z.string()),
  shortTermActionPlan: z.array(z.string()),
  longTermAcademicRecommendations: z.array(z.string()),
});

export type StudentSuccessOutput = z.infer<typeof StudentSuccessOutputSchema>;

// Placement Readiness Agent Input/Output Schemas
export const PlacementReadinessInputSchema = z.object({
  studentId: z.string().min(1, 'studentId is required'),
  customParams: z.record(z.any()).optional(),
});

export type PlacementReadinessInput = z.infer<typeof PlacementReadinessInputSchema>;

export const PlacementReadinessOutputSchema = z.object({
  placementReadinessAssessment: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  skillGaps: z.array(z.string()),
  resumeReadiness: z.string(),
  interviewReadiness: z.string(),
  technicalReadiness: z.string(),
  recommendedActions: z.array(z.string()),
  preparationPriorities: z.array(z.string()),
});

export type PlacementReadinessOutput = z.infer<typeof PlacementReadinessOutputSchema>;

// Learning Path Agent Input/Output Schemas
export const LearningPathInputSchema = z.object({
  studentId: z.string().min(1, 'studentId is required'),
  customParams: z.record(z.any()).optional(),
});

export type LearningPathInput = z.infer<typeof LearningPathInputSchema>;

export const LearningPathOutputSchema = z.object({
  targetCareer: z.string(),
  requiredSkills: z.array(z.string()),
  currentSkillLevel: z.string(),
  skillGaps: z.array(z.string()),
  learningModules: z.array(
    z.object({
      moduleTitle: z.string(),
      topics: z.array(z.string()),
      practiceTasks: z.array(z.string()),
      projects: z.array(z.string()),
      estimatedPriority: z.string(),
    })
  ),
  milestones: z.array(z.string()),
  recommendedSequence: z.array(z.string()),
});

export type LearningPathOutput = z.infer<typeof LearningPathOutputSchema>;

// Faculty Insights Agent Input/Output Schemas
export const FacultyInsightsInputSchema = z.object({
  studentId: z.string().min(1, 'studentId is required'),
  customParams: z.record(z.any()).optional(),
});

export type FacultyInsightsInput = z.infer<typeof FacultyInsightsInputSchema>;

export const FacultyInsightsOutputSchema = z.object({
  studentsNeedingAttention: z.array(
    z.object({
      studentName: z.string(),
      studentId: z.string(),
      academicConcerns: z.array(z.string()),
      attendanceConcerns: z.array(z.string()),
      learningConcerns: z.array(z.string()),
      placementConcerns: z.array(z.string()),
      recommendedIntervention: z.string(),
      evidence: z.string(),
    })
  ),
});

export type FacultyInsightsOutput = z.infer<typeof FacultyInsightsOutputSchema>;

// Placement Analytics Agent Input/Output Schemas
export const PlacementAnalyticsInputSchema = z.object({
  studentId: z.string().min(1, 'studentId is required'),
  customParams: z.record(z.any()).optional(),
});

export type PlacementAnalyticsInput = z.infer<typeof PlacementAnalyticsInputSchema>;

export const PlacementAnalyticsOutputSchema = z.object({
  placementTrends: z.array(z.string()),
  skillDemand: z.array(z.object({ skill: z.string(), demandLevel: z.string() })),
  roleDemand: z.array(z.object({ role: z.string(), demandLevel: z.string() })),
  companyTrends: z.array(z.string()),
  departmentTrends: z.array(z.string()),
  readinessTrends: z.array(z.string()),
  hiringObservations: z.array(z.string()),
  recommendedInstitutionalActions: z.array(z.string()),
});

export type PlacementAnalyticsOutput = z.infer<typeof PlacementAnalyticsOutputSchema>;

// Career Recommendation Agent Input/Output Schemas
export const CareerRecommendationInputSchema = z.object({
  studentId: z.string().min(1, 'studentId is required'),
  customParams: z.record(z.any()).optional(),
});

export type CareerRecommendationInput = z.infer<typeof CareerRecommendationInputSchema>;

export const CareerRecommendationOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      role: z.string(),
      whyItMatches: z.string(),
      matchingSkills: z.array(z.string()),
      missingSkills: z.array(z.string()),
      recommendedProjects: z.array(z.string()),
      recommendedLearning: z.array(z.string()),
      suggestedNextSteps: z.array(z.string()),
    })
  ),
});

export type CareerRecommendationOutput = z.infer<typeof CareerRecommendationOutputSchema>;

// Mock Interview Agent Input/Output Schemas
export const MockInterviewInputSchema = z.object({
  studentId: z.string().min(1, 'studentId is required'),
  customParams: z.object({
    mode: z.enum(['question', 'evaluation', 'feedback']),
    type: z.enum(['TECHNICAL', 'BEHAVIORAL', 'HR', 'RESUME']).optional(),
    jobId: z.string().optional(),
    question: z.string().optional(),
    answer: z.string().optional(),
    history: z.array(z.any()).optional(),
  }),
});

export type MockInterviewInput = z.infer<typeof MockInterviewInputSchema>;

export const MockInterviewOutputSchema = z.object({
  question: z.string().optional(),
  correctness: z.string().optional(),
  relevance: z.string().optional(),
  completeness: z.string().optional(),
  communicationQuality: z.string().optional(),
  structure: z.string().optional(),
  technicalDepth: z.string().optional(),
  score: z.number().optional(),
  feedback: z.string().optional(),
  overallScore: z.number().optional(),
  overallFeedback: z.string().optional(),
});

export type MockInterviewOutput = z.infer<typeof MockInterviewOutputSchema>;

// Resume Intelligence Agent Input/Output Schemas
export const ResumeIntelligenceInputSchema = z.object({
  studentId: z.string().min(1, 'studentId is required'),
  customParams: z.object({
    resumeContent: z.string().optional(),
    jobId: z.string().optional(),
  }).optional(),
});

export type ResumeIntelligenceInput = z.infer<typeof ResumeIntelligenceInputSchema>;

export const ResumeIntelligenceOutputSchema = z.object({
  parsedVerifiedInfo: z.object({
    skills: z.array(z.string()),
    projects: z.array(z.string()),
    certifications: z.array(z.string()),
    education: z.string(),
  }),
  aiSuggestions: z.object({
    improvedBullets: z.array(z.string()),
    tailoringSuggestions: z.array(z.string()),
    summary: z.string(),
  }),
  atsAnalysis: z.object({
    score: z.number(),
    keywords: z.array(z.string()),
    skills: z.array(z.string()),
    structure: z.string(),
    sectionCompleteness: z.string(),
    jobAlignment: z.string(),
    readability: z.string(),
  }),
});

export type ResumeIntelligenceOutput = z.infer<typeof ResumeIntelligenceOutputSchema>;

// Job Matching Agent Input/Output Schemas
export const JobMatchingInputSchema = z.object({
  studentId: z.string().min(1, 'studentId is required'),
  customParams: z.object({
    jobId: z.string().optional(), // if provided, match against a specific job
  }).optional(),
});

export type JobMatchingInput = z.infer<typeof JobMatchingInputSchema>;

export const JobMatchingOutputSchema = z.object({
  matches: z.array(
    z.object({
      jobId: z.string(),
      jobTitle: z.string(),
      companyName: z.string(),
      // Deterministic fields — computed by backend, AI cannot override
      eligible: z.boolean(),
      eligibilityReasons: z.array(z.string()),
      failedChecks: z.array(z.string()),
      matchingSkills: z.array(z.string()),
      missingSkills: z.array(z.string()),
      skillMatchPercent: z.number(),
      // AI semantic fields
      matchScore: z.number(),
      strengths: z.array(z.string()),
      weaknesses: z.array(z.string()),
      preparationRecommendations: z.array(z.string()),
      explanation: z.string(),
    })
  ),
});

export type JobMatchingOutput = z.infer<typeof JobMatchingOutputSchema>;

// Application Strategy Agent Input/Output Schemas
export const ApplicationStrategyInputSchema = z.object({
  studentId: z.string().min(1, 'studentId is required'),
});

export type ApplicationStrategyInput = z.infer<typeof ApplicationStrategyInputSchema>;

export const ApplicationStrategyOutputSchema = z.object({
  highPriorityJobs: z.array(
    z.object({
      jobId: z.string(),
      title: z.string(),
      companyName: z.string(),
      reasoning: z.string(),
    })
  ),
  mediumPriorityJobs: z.array(
    z.object({
      jobId: z.string(),
      title: z.string(),
      companyName: z.string(),
      reasoning: z.string(),
    })
  ),
  lowPriorityJobs: z.array(
    z.object({
      jobId: z.string(),
      title: z.string(),
      companyName: z.string(),
      reasoning: z.string(),
    })
  ),
  preparationRequired: z.array(z.string()),
  resumeChangesRequired: z.array(z.string()),
  interviewTopics: z.array(z.string()),
  recommendedNextAction: z.string(),
});

export type ApplicationStrategyOutput = z.infer<typeof ApplicationStrategyOutputSchema>;

// Skill Gap Agent Input/Output Schemas
export const SkillGapInputSchema = z.object({
  studentId: z.string().min(1, 'studentId is required'),
  customParams: z.object({
    jobId: z.string().optional(),
    targetCareer: z.string().optional(),
  }).optional(),
});

export type SkillGapInput = z.infer<typeof SkillGapInputSchema>;

export const SkillGapOutputSchema = z.object({
  criticalGaps: z.array(z.string()),
  importantGaps: z.array(z.string()),
  optionalGaps: z.array(z.string()),
  existingStrengths: z.array(z.string()),
  evidenceGaps: z.array(
    z.object({
      skillName: z.string(),
      currentEvidence: z.string(),
      recommendation: z.string(),
    })
  ),
  recommendedLearning: z.array(
    z.object({
      topic: z.string(),
      resourceName: z.string(),
      difficulty: z.string(),
    })
  ),
  skillBreakdown: z.array(
    z.object({
      skillName: z.string(),
      status: z.enum(['DECLARED', 'VERIFIED', 'DEMONSTRATED', 'MISSING_EVIDENCE']),
    })
  ),
});

export type SkillGapOutput = z.infer<typeof SkillGapOutputSchema>;

// Career Growth Agent Input/Output Schemas
export const CareerGrowthInputSchema = z.object({
  studentId: z.string().min(1, 'studentId is required'),
});

export type CareerGrowthInput = z.infer<typeof CareerGrowthInputSchema>;

export const CareerGrowthOutputSchema = z.object({
  currentCareerStage: z.string(),
  overallProgress: z.string(),
  strengths: z.array(z.string()),
  developmentAreas: z.array(z.string()),
  nextMilestone: z.string(),
  recommendedSkills: z.array(z.string()),
  recommendedProjects: z.array(z.string()),
  recommendedExperiences: z.array(z.string()),
  timeline: z.array(
    z.object({
      period: z.string(),
      event: z.string(),
      category: z.enum(['SKILL', 'PROJECT', 'CERTIFICATION', 'INTERVIEW', 'ACADEMIC', 'APPLICATION']),
      impact: z.string(),
    })
  ),
});

export type CareerGrowthOutput = z.infer<typeof CareerGrowthOutputSchema>;

// Student Risk Prediction Agent Input/Output Schemas
export const StudentRiskInputSchema = z.object({
  studentId: z.string().min(1, 'studentId is required'),
});

export type StudentRiskInput = z.infer<typeof StudentRiskInputSchema>;

export const StudentRiskOutputSchema = z.object({
  riskIndicator: z.enum(['NONE', 'LOW', 'MEDIUM', 'HIGH']),
  evidence: z.array(z.string()),
  severity: z.enum(['NONE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  confidence: z.number().min(0).max(100),
  recommendedHumanIntervention: z.string(),
  isAIAssisted: z.literal(true),
  label: z.string(),
});

export type StudentRiskOutput = z.infer<typeof StudentRiskOutputSchema>;

// Student Engagement Agent Input/Output Schemas
export const StudentEngagementInputSchema = z.object({
  studentId: z.string().min(1, 'studentId is required'),
});

export type StudentEngagementInput = z.infer<typeof StudentEngagementInputSchema>;

export const StudentEngagementOutputSchema = z.object({
  meaningfulAlert: z.boolean(),
  alerts: z.array(
    z.object({
      title: z.string(),
      message: z.string(),
      type: z.enum(['academic', 'placement', 'career', 'AI']),
      priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
    })
  ),
  recommendations: z.array(z.string()),
});

export type StudentEngagementOutput = z.infer<typeof StudentEngagementOutputSchema>;

// Placement Preparation Agent Input/Output Schemas
export const PlacementPreparationInputSchema = z.object({
  studentId: z.string().min(1, 'studentId is required'),
});

export type PlacementPreparationInput = z.infer<typeof PlacementPreparationInputSchema>;

export const PlacementPreparationOutputSchema = z.object({
  currentPriorities: z.array(z.string()),
  technicalTopics: z.array(z.string()),
  dsaPractice: z.array(z.string()),
  projects: z.array(z.string()),
  resumeTasks: z.array(z.string()),
  mockInterviews: z.array(z.string()),
  jobApplications: z.array(z.string()),
  weeklyMilestones: z.array(
    z.object({
      week: z.number(),
      goal: z.string(),
      tasks: z.array(z.string()),
    })
  ),
  highestValueNextActions: z.array(z.string()),
  sourceSummary: z.object({
    placementReadinessScore: z.number(),
    criticalSkillGaps: z.array(z.string()),
    resumeScore: z.number().optional(),
    openApplications: z.number(),
    completedMockInterviews: z.number(),
  }),
});

export type PlacementPreparationOutput = z.infer<typeof PlacementPreparationOutputSchema>;

// Faculty Intervention Agent Input/Output Schemas
export const FacultyInterventionInputSchema = z.object({
  studentId: z.string().min(1, 'studentId is required'),
});

export type FacultyInterventionInput = z.infer<typeof FacultyInterventionInputSchema>;

export const FacultyInterventionOutputSchema = z.object({
  studentId: z.string(),
  studentName: z.string(),
  metrics: z.object({
    academicRisk: z.object({
      riskLevel: z.enum(['NONE', 'LOW', 'MEDIUM', 'HIGH']),
      evidence: z.string(),
    }),
    attendance: z.object({
      attendanceRate: z.number(),
      evidence: z.string(),
    }),
    learningProgress: z.object({
      progressState: z.string(),
      evidence: z.string(),
    }),
    skillGaps: z.object({
      gaps: z.array(z.string()),
      evidence: z.string(),
    }),
    placementReadiness: z.object({
      readinessScore: z.number(),
      evidence: z.string(),
    }),
    interviewPerformance: z.object({
      performanceState: z.string(),
      evidence: z.string(),
    }),
  }),
  recommendations: z.array(
    z.object({
      type: z.enum(['academic', 'mentoring', 'learning_support', 'placement_support', 'resume_support', 'interview_support']),
      action: z.string(),
      evidence: z.string(),
    })
  ),
});

export type FacultyInterventionOutput = z.infer<typeof FacultyInterventionOutputSchema>;

// Placement Officer Copilot Agent Input/Output Schemas
export const PlacementOfficerCopilotInputSchema = z.object({
  studentId: z.string().optional(),
  customParams: z.object({
    query: z.string().min(1, 'Query is required'),
  }),
});

export type PlacementOfficerCopilotInput = z.infer<typeof PlacementOfficerCopilotInputSchema>;

export const PlacementOfficerCopilotOutputSchema = z.object({
  query: z.string(),
  interpretation: z.string(),
  deterministicData: z.any(),
  explanation: z.string(),
  recommendedAction: z.string(),
  isAIAssisted: z.literal(true),
  label: z.string(),
});

export type PlacementOfficerCopilotOutput = z.infer<typeof PlacementOfficerCopilotOutputSchema>;

// Data Quality Agent Input/Output Schemas
export const DataQualityInputSchema = z.object({
  studentId: z.string().optional(),
});

export type DataQualityInput = z.infer<typeof DataQualityInputSchema>;

export const DataQualityOutputSchema = z.object({
  issues: z.array(
    z.object({
      type: z.enum([
        'DUPLICATE_STUDENT',
        'DUPLICATE_RECORD',
        'INVALID_RELATIONSHIP',
        'MISSING_FIELD',
        'CONFLICTING_ACADEMIC_DATA',
        'INVALID_URL',
        'INCOMPLETE_PROFILE',
        'DUPLICATE_SKILLS',
        'STALE_INSIGHT',
      ]),
      severity: z.enum(['CRITICAL', 'WARNING', 'INFO']),
      affectedRecord: z.string(),
      evidence: z.string(),
      suggestedCorrection: z.string(),
    })
  ),
  needsConfirmation: z.literal(true),
  label: z.string(),
});

export type DataQualityOutput = z.infer<typeof DataQualityOutputSchema>;

// AI Governance Agent Input/Output Schemas
export const AIGovernanceInputSchema = z.object({
  studentId: z.string().optional(),
});

export type AIGovernanceInput = z.infer<typeof AIGovernanceInputSchema>;

export const AIGovernanceOutputSchema = z.object({
  totalExecutions: z.number(),
  averageLatencyMs: z.number(),
  totalCostUsd: z.number(),
  failuresCount: z.number(),
  validationFailuresCount: z.number(),
  injectionAttemptsCount: z.number(),
  staleInsightsCount: z.number(),
  auditTrail: z.array(
    z.object({
      timestamp: z.string(),
      feature: z.string(),
      action: z.string(),
      details: z.any(),
    })
  ),
  insights: z.string(),
  isAIAssisted: z.literal(true),
  label: z.string(),
});

export type AIGovernanceOutput = z.infer<typeof AIGovernanceOutputSchema>;

// AI Orchestrator Input/Output Schemas
export const OrchestratorInputSchema = z.object({
  studentId: z.string().optional(),
  pipeline: z.array(z.string()).min(1, 'Pipeline array of agent names is required'),
  customParams: z.object({
    query: z.string().optional(),
  }).optional(),
});

export type OrchestratorInput = z.infer<typeof OrchestratorInputSchema>;

export const OrchestratorOutputSchema = z.object({
  pipeline: z.array(z.string()),
  results: z.record(
    z.object({
      success: z.boolean(),
      data: z.any().optional(),
      error: z.string().optional(),
    })
  ),
  synthesis: z.string(),
  isAIAssisted: z.literal(true),
  label: z.string(),
});

export type OrchestratorOutput = z.infer<typeof OrchestratorOutputSchema>;
