import { Schema, model } from 'mongoose';
const InterviewSchema = new Schema({
    application: {
        type: Schema.Types.ObjectId,
        ref: 'JobApplication',
        required: true,
        index: true,
    },
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
    },
    date: {
        type: Date,
        required: true,
    },
    type: {
        type: String,
        enum: ['TECHNICAL', 'BEHAVIORAL', 'HR'],
        default: 'TECHNICAL',
        required: true,
    },
    status: {
        type: String,
        enum: ['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'],
        default: 'SCHEDULED',
        required: true,
    },
    meetingUrl: {
        type: String,
    },
    feedback: {
        type: String,
    },
    score: {
        type: Number,
        min: 0,
        max: 100,
    },
}, {
    timestamps: true,
});
InterviewSchema.index({ student: 1, date: -1 });
InterviewSchema.index({ status: 1, date: 1 });
export const Interview = model('Interview', InterviewSchema);
