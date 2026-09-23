import { Schema, model } from 'mongoose';
const AIUsageSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    feature: {
        type: String,
        required: true,
    },
    promptTokens: {
        type: Number,
        default: 0,
    },
    completionTokens: {
        type: Number,
        default: 0,
    },
    totalTokens: {
        type: Number,
        default: 0,
    },
    modelUsed: {
        type: String,
        required: true,
    },
}, {
    timestamps: { createdAt: true, updatedAt: false },
});
export const AIUsage = model('AIUsage', AIUsageSchema);
