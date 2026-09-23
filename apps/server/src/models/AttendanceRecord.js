import { Schema, model } from 'mongoose';
const AttendanceRecordSchema = new Schema({
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
}, {
    timestamps: true,
});
export const AttendanceRecord = model('AttendanceRecord', AttendanceRecordSchema);
