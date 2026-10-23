import { Schema, model } from 'mongoose';
import { UserRole } from '@campusgent/shared';

const AnnouncementSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Announcement title is required'],
        trim: true,
    },
    content: {
        type: String,
        required: [true, 'Announcement content is required'],
        trim: true,
    },
    priority: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
        default: 'MEDIUM',
    },
    targetRoles: [
        {
            type: String,
            enum: Object.values(UserRole),
        },
    ],
    department: {
        type: Schema.Types.ObjectId,
        ref: 'Department',
        default: null, // null = all departments
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
        default: 'PUBLISHED',
    },
    publishedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

AnnouncementSchema.index({ status: 1, publishedAt: -1, department: 1 });
AnnouncementSchema.index({ priority: 1, status: 1 });

export const Announcement = model('Announcement', AnnouncementSchema);
