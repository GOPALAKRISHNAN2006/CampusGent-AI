import { Schema, model, Document, Types } from 'mongoose';

export interface IStudentMark extends Document {
  assessmentId: Types.ObjectId; // Refers to Assessment
  student: Types.ObjectId; // Refers to StudentProfile
  marksObtained: number;
  remarks: string;
  createdAt: Date;
  updatedAt: Date;
}

const StudentMarkSchema = new Schema<IStudentMark>(
  {
    assessmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Assessment',
      required: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: 'StudentProfile',
      required: true,
    },
    marksObtained: {
      type: Number,
      required: true,
      min: 0,
    },
    remarks: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const StudentMark = model<IStudentMark>('StudentMark', StudentMarkSchema);
