import { Schema, model, Document, Types } from 'mongoose';

export interface ITimetableSlot {
  day: string; // e.g. "Monday"
  time: string; // e.g. "10:00 AM"
  room: string; // e.g. "Room 204"
}

export interface ICourseClass extends Document {
  courseCode: string;
  subjectName: string;
  section: string;
  semester: number;
  faculty: Types.ObjectId; // Refers to User
  students: Types.ObjectId[]; // Refers to StudentProfile
  timetable: ITimetableSlot[];
  createdAt: Date;
  updatedAt: Date;
}

const CourseClassSchema = new Schema<ICourseClass>(
  {
    courseCode: {
      type: String,
      required: true,
      trim: true,
    },
    subjectName: {
      type: String,
      required: true,
      trim: true,
    },
    section: {
      type: String,
      required: true,
      trim: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    faculty: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: 'StudentProfile',
      },
    ],
    timetable: [
      {
        day: { type: String, required: true },
        time: { type: String, required: true },
        room: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const CourseClass = model<ICourseClass>('CourseClass', CourseClassSchema);
