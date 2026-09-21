import { UserRoleType } from '@campusgent/shared';

export interface AgentMetadata {
  name: string;
  version: string;
  description: string;
  permissions: string[];
  promptVersion: string;
}

export interface StudentIntelligenceSnapshot {
  studentId: string;
  academic: {
    cgpa: number;
    semester: number;
    backlogs: number;
    attendance: number;
  };
  skills: {
    name: string;
    proficiency: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
    verified: boolean;
  }[];
  projects: {
    title: string;
    description: string;
    technologies: string[];
  }[];
  applications: {
    jobId: string;
    jobTitle: string;
    companyName: string;
    status: string;
  }[];
  interviews: {
    jobTitle: string;
    type: string;
    status: string;
    score?: number;
  }[];
}

export interface IAgent {
  metadata: AgentMetadata;
  execute(snapshot: StudentIntelligenceSnapshot, customParams?: any): Promise<any>;
}
