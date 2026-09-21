import { Schema, model, Document } from 'mongoose';

export interface IDepartment extends Document {
  name: string;
  code: string; // CSE, ECE, MECH etc.
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DepartmentSchema = new Schema<IDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Department = model<IDepartment>('Department', DepartmentSchema);
