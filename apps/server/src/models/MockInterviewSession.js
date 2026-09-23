import { Schema, model } from 'mongoose';
const MockInterviewSessionSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    job: {
        type: Schema.Types.ObjectId,
        ref: 'Job',
    },
    type: {
        type: String,
        enum: ['TECHNICAL', 'BEHAVIORAL', 'HR', 'RESUME'],
        required: true,
    },
    status: {
        type: String,
        enum: ['STARTED', 'COMPLETED'],
        default: 'STARTED',
        required: true,
    },
    turns: [
        {
            question: { type: String, required: true },
            answer: { type: String },
            evaluation: {
                correctness: { type: String },
                relevance: { type: String },
                completeness: { type: String },
                communicationQuality: { type: String },
                structure: { type: String },
                technicalDepth: { type: String },
                score: { type: Number, min: 0, max: 100 },
                feedback: { type: String },
            },
            agentVersion: { type: String, required: true },
            modelUsed: { type: String, required: true },
            timestamp: { type: Date, default: Date.now },
        },
    ],
    overallScore: { type: Number, min: 0, max: 100 },
    overallFeedback: { type: String },
}, {
    timestamps: true,
});
export const MockInterviewSession = model('MockInterviewSession', MockInterviewSessionSchema);
