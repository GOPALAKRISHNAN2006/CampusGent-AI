import { Schema, model, Document, Types } from 'mongoose';

export interface IStudentAttendance {
  student: Types.ObjectId; // Refers to StudentProfile
  status: 'PRESENT' | 'ABSENT' | 'LATE';
}

export interface IAttendanceRecord extends Document {
  classId: Types.ObjectId; // Refers to CourseClass
  date: Date;
  records: IStudentAttendance[];
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceRecordSchema = new Schema<IAttendanceRecord>(
  {
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'CourseClass',
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    records: [
      {
        student: {
          type: Schema.Types.ObjectId,
          ref: 'StudentProfile',
          required: true,
        },
        status: {
          type: String,
          enum: ['PRESENT', 'ABSENT', 'LATE'],
          default: 'PRESENT',
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const AttendanceRecord = model<IAttendanceRecord>('AttendanceRecord', AttendanceRecordSchema);
