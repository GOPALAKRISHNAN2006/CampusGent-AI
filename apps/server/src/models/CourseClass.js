import { Schema, model } from 'mongoose';
const CourseClassSchema = new Schema({
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
}, {
    timestamps: true,
});
// Performance indexes for faculty assigned classes and semester schedule queries
CourseClassSchema.index({ faculty: 1 });
CourseClassSchema.index({ semester: 1, courseCode: 1 });
export const CourseClass = model('CourseClass', CourseClassSchema);
