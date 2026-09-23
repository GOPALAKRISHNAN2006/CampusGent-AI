import { Schema, model } from 'mongoose';
const AuditLogSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true,
    },
    action: {
        type: String,
        required: true,
        index: true,
    },
    ipAddress: {
        type: String,
    },
    userAgent: {
        type: String,
    },
    details: {
        type: Schema.Types.Mixed,
    },
}, {
    timestamps: { createdAt: true, updatedAt: false },
});
export const AuditLog = model('AuditLog', AuditLogSchema);
