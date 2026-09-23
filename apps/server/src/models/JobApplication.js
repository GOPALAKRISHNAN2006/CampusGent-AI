import { Schema, model } from 'mongoose';
import { ApplicationStatus } from '@campusgent/shared';
const JobApplicationSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    job: {
        type: Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
        index: true,
    },
    status: {
        type: String,
        enum: Object.values(ApplicationStatus),
        default: ApplicationStatus.APPLIED,
        required: true,
    },
    appliedAt: {
        type: Date,
        default: Date.now,
    },
    resumeUrl: {
        type: String,
    },
    notes: {
        type: String,
        trim: true,
    },
    timeline: [
        {
            status: {
                type: String,
                enum: Object.values(ApplicationStatus),
                required: true,
            },
            updatedAt: {
                type: Date,
                default: Date.now,
            },
            updatedBy: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            remarks: {
                type: String,
            },
        },
    ],
}, {
    timestamps: true,
});
// Prevent duplicate applications
JobApplicationSchema.index({ student: 1, job: 1 }, { unique: true });
JobApplicationSchema.index({ student: 1, appliedAt: -1 });
JobApplicationSchema.index({ student: 1, status: 1 });
export const JobApplication = model('JobApplication', JobApplicationSchema);
