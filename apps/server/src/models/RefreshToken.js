import { Schema, model } from 'mongoose';
const RefreshTokenSchema = new Schema({
    token: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
}, {
    timestamps: { createdAt: true, updatedAt: false },
});
// TTL index to automatically expire documents from MongoDB
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export const RefreshToken = model('RefreshToken', RefreshTokenSchema);
