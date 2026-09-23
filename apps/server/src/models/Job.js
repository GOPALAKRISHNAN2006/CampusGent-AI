import { Schema, model } from 'mongoose';
import { EmploymentType, JobStatus } from '@campusgent/shared';
const JobSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Job title is required'],
        trim: true,
    },
    companyName: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Job description is required'],
    },
    location: {
        type: String,
        required: [true, 'Job location is required'],
    },
    employmentType: {
        type: String,
        enum: Object.values(EmploymentType),
        required: true,
    },
    salaryMin: {
        type: Number,
        default: 0,
    },
    salaryMax: {
        type: Number,
        default: 0,
    },
    requiredSkills: [{ type: String }],
    experienceRequired: {
        type: Number,
        default: 0,
    },
    eligibilityCriteria: {
        minCgpa: {
            type: Number,
            default: 0,
        },
        allowedDepartments: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Department',
            },
        ],
        maxBacklogsAllowed: {
            type: Number,
            default: 0,
        },
    },
    applicationDeadline: {
        type: Date,
        required: [true, 'Application deadline is required'],
    },
    status: {
        type: String,
        enum: Object.values(JobStatus),
        default: JobStatus.ACTIVE,
        required: true,
    },
}, {
    timestamps: true,
});
JobSchema.index({ status: 1, applicationDeadline: 1 });
JobSchema.index({ 'eligibilityCriteria.allowedDepartments': 1, status: 1 });
export const Job = model('Job', JobSchema);
