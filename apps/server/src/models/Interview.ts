import { Schema, model, Document, Types } from 'mongoose';

export interface IInterview extends Document {
  application: Types.ObjectId;
  student: Types.ObjectId;
  job: Types.ObjectId;
  date: Date;
  type: 'TECHNICAL' | 'BEHAVIORAL' | 'HR';
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  meetingUrl?: string;
  feedback?: string;
  score?: number;
  createdAt: Date;
  updatedAt: Date;
}

const InterviewSchema = new Schema<IInterview>(
  {
    application: {
      type: Schema.Types.ObjectId,
      ref: 'JobApplication',
      required: true,
      index: true,
    },
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
    },
    date: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      enum: ['TECHNICAL', 'BEHAVIORAL', 'HR'],
      default: 'TECHNICAL',
      required: true,
    },
    status: {
      type: String,
      enum: ['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'],
      default: 'SCHEDULED',
      required: true,
    },
    meetingUrl: {
      type: String,
    },
    feedback: {
      type: String,
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

export const Interview = model<IInterview>('Interview', InterviewSchema);
