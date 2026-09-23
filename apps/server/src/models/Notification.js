import { Schema, model } from 'mongoose';
const NotificationSchema = new Schema({
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    type: {
        type: String,
        enum: ['academic', 'placement', 'career', 'AI', 'system'],
        default: 'system',
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    message: {
        type: String,
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
        required: true,
    },
}, {
    timestamps: true,
});
NotificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });
export const Notification = model('Notification', NotificationSchema);
