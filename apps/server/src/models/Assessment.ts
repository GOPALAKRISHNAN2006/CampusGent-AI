import { Schema, model, Document, Types } from 'mongoose';

export interface IAssessment extends Document {
  classId: Types.ObjectId; // Refers to CourseClass
  title: string;
  description: string;
  date: Date;
  totalMarks: number;
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED';
  questionCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const AssessmentSchema = new Schema<IAssessment>(
  {
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'CourseClass',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ['UPCOMING', 'ACTIVE', 'COMPLETED'],
      default: 'UPCOMING',
    },
    questionCount: {
      type: Number,
      default: 5,
    },
  },
  {
    timestamps: true,
  }
);

export const Assessment = model<IAssessment>('Assessment', AssessmentSchema);
