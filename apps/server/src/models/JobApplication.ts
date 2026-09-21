import { Schema, model, Document, Types } from 'mongoose';
import { ApplicationStatus, ApplicationStatusType } from '@campusgent/shared';

export interface IJobApplication extends Document {
  student: Types.ObjectId;
  job: Types.ObjectId;
  status: ApplicationStatusType;
  appliedAt: Date;
  resumeUrl?: string;
  notes?: string;
  timeline: {
    status: ApplicationStatusType;
    updatedAt: Date;
    updatedBy: Types.ObjectId;
    remarks?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const JobApplicationSchema = new Schema<IJobApplication>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    job: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(ApplicationStatus),
      default: ApplicationStatus.APPLIED,
      required: true,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    resumeUrl: {
      type: String,
    },
    notes: {
      type: String,
      trim: true,
    },
    timeline: [
      {
        status: {
          type: String,
          enum: Object.values(ApplicationStatus),
          required: true,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
        updatedBy: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        remarks: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications
JobApplicationSchema.index({ student: 1, job: 1 }, { unique: true });

export const JobApplication = model<IJobApplication>('JobApplication', JobApplicationSchema);
