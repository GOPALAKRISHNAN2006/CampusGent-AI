import { Schema, model } from 'mongoose';
const StudentMarkSchema = new Schema({
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
}, {
    timestamps: true,
});
// Performance indexes for class assessment score lookups and student grade history
StudentMarkSchema.index({ assessmentId: 1, student: 1 });
StudentMarkSchema.index({ student: 1 });
export const StudentMark = model('StudentMark', StudentMarkSchema);
