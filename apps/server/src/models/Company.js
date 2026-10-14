import { Schema, model } from 'mongoose';

const CompanySchema = new Schema({
    name: {
        type: String,
        required: [true, 'Company name is required'],
        unique: true,
        trim: true,
    },
    industry: {
        type: String,
        default: 'Information Technology',
        trim: true,
    },
    recruiterName: {
        type: String,
        default: '',
        trim: true,
    },
    recruiterEmail: {
        type: String,
        default: '',
        trim: true,
    },
    recruiterPhone: {
        type: String,
        default: '',
        trim: true,
    },
    website: {
        type: String,
        default: '',
        trim: true,
    },
    location: {
        type: String,
        default: '',
        trim: true,
    },
    notes: {
        type: String,
        default: '',
        trim: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
});

export const Company = model('Company', CompanySchema);
