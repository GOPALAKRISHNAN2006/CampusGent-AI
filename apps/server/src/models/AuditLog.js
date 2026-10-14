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
// Performance index for admin audit log pagination and chronological inspection
AuditLogSchema.index({ createdAt: -1 });
AuditLogSchema.index({ user: 1, createdAt: -1 });
export const AuditLog = model('AuditLog', AuditLogSchema);
