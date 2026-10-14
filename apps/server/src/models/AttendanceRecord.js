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
// Performance index for class attendance log queries and daily deduplication checks
AttendanceRecordSchema.index({ classId: 1, date: -1 });
export const AttendanceRecord = model('AttendanceRecord', AttendanceRecordSchema);
