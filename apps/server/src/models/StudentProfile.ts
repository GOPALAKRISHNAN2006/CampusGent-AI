import { Schema, model, Document, Types } from 'mongoose';

export interface IStudentProfile extends Document {
  user: Types.ObjectId;
  rollNumber: string;
  department: Types.ObjectId;
  semester: number;
  cgpa: number;
  skills: {
    name: string;
    proficiency: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
    verified: boolean;
  }[];
  projects: {
    title: string;
    description: string;
    technologies: string[];
    githubUrl?: string;
    demoUrl?: string;
  }[];
  certifications: {
    name: string;
    issuingOrg: string;
    issueDate: Date;
    credentialUrl?: string;
  }[];
  resumeUrl?: string;
  githubProfile?: string;
  linkedinProfile?: string;
  portfolioUrl?: string;
  careerInterests: string[];
  careerGoals: string[];
  placementReadinessScore: number;
  createdAt: Date;
  updatedAt: Date;
}

const StudentProfileSchema = new Schema<IStudentProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    rollNumber: {
      type: String,
      required: [true, 'Roll number is required'],
      unique: true,
      trim: true,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    cgpa: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
      default: 0,
    },
    skills: [
      {
        name: { type: String, required: true },
        proficiency: {
          type: String,
          enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'],
          default: 'BEGINNER',
        },
        verified: { type: Boolean, default: false },
      },
    ],
    projects: [
      {
        title: { type: String, required: true },
        description: { type: String },
        technologies: [{ type: String }],
        githubUrl: { type: String },
        demoUrl: { type: String },
      },
    ],
    certifications: [
      {
        name: { type: String, required: true },
        issuingOrg: { type: String, required: true },
        issueDate: { type: Date, required: true },
        credentialUrl: { type: String },
      },
    ],
    resumeUrl: {
      type: String,
    },
    githubProfile: {
      type: String,
    },
    linkedinProfile: {
      type: String,
    },
    portfolioUrl: {
      type: String,
    },
    careerInterests: [{ type: String }],
    careerGoals: [{ type: String }],
    placementReadinessScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

export const StudentProfile = model<IStudentProfile>('StudentProfile', StudentProfileSchema);
