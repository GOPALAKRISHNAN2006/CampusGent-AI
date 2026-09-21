import { Schema, model, Document, Types } from 'mongoose';

export interface IFacultyProfile extends Document {
  user: Types.ObjectId;
  employeeId: string;
  department: Types.ObjectId;
  assignedSubjects: string[];
  createdAt: Date;
  updatedAt: Date;
}

const FacultyProfileSchema = new Schema<IFacultyProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      unique: true,
      trim: true,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    assignedSubjects: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export const FacultyProfile = model<IFacultyProfile>('FacultyProfile', FacultyProfileSchema);
