import { Schema, model } from 'mongoose';
import { UserRole, UserStatus } from '@campusgent/shared';
const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        index: true,
    },
    passwordHash: {
        type: String,
        required: [true, 'Password hash is required'],
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.STUDENT,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(UserStatus),
        default: UserStatus.ACTIVE,
        required: true,
    },
    department: {
        type: Schema.Types.ObjectId,
        ref: 'Department',
    },
    lastLoginAt: {
        type: Date,
    },
}, {
    timestamps: true,
});
export const User = model('User', UserSchema);
