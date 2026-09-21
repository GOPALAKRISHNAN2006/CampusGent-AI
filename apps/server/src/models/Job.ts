import { Schema, model, Document, Types } from 'mongoose';
import { EmploymentType, JobStatus, EmploymentTypeType, JobStatusType } from '@campusgent/shared';

export interface IJob extends Document {
  title: string;
  companyName: string;
  description: string;
  location: string;
  employmentType: EmploymentTypeType;
  salaryMin: number;
  salaryMax: number;
  requiredSkills: string[];
  experienceRequired: number; // in years
  eligibilityCriteria: {
    minCgpa: number;
    allowedDepartments: Types.ObjectId[];
    maxBacklogsAllowed: number;
  };
  applicationDeadline: Date;
  status: JobStatusType;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    location: {
      type: String,
      required: [true, 'Job location is required'],
    },
    employmentType: {
      type: String,
      enum: Object.values(EmploymentType),
      required: true,
    },
    salaryMin: {
      type: Number,
      default: 0,
    },
    salaryMax: {
      type: Number,
      default: 0,
    },
    requiredSkills: [{ type: String }],
    experienceRequired: {
      type: Number,
      default: 0,
    },
    eligibilityCriteria: {
      minCgpa: {
        type: Number,
        default: 0,
      },
      allowedDepartments: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Department',
        },
      ],
      maxBacklogsAllowed: {
        type: Number,
        default: 0,
      },
    },
    applicationDeadline: {
      type: Date,
      required: [true, 'Application deadline is required'],
    },
    status: {
      type: String,
      enum: Object.values(JobStatus),
      default: JobStatus.ACTIVE,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Job = model<IJob>('Job', JobSchema);
