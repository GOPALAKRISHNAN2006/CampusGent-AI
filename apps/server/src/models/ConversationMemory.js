import { Schema, model } from 'mongoose';

const MessageTurnSchema = new Schema({
    role: {
        type: String,
        enum: ['user', 'assistant', 'system'],
        required: true,
    },
    agent: {
        type: String,
        default: 'assistant',
    },
    intent: {
        type: String,
        default: 'general',
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
}, { _id: true });

const ConversationMemorySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    title: {
        type: String,
        trim: true,
        default: 'General Inquiries',
    },
    turns: [MessageTurnSchema],
    lastActive: {
        type: Date,
        default: Date.now,
        index: true,
    },
    isArchived: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

ConversationMemorySchema.index({ user: 1, lastActive: -1 });

export const ConversationMemory = model('ConversationMemory', ConversationMemorySchema);
