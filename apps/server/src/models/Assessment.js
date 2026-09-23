import { Schema, model } from 'mongoose';
const AssessmentSchema = new Schema({
    classId: {
        type: Schema.Types.ObjectId,
        ref: 'CourseClass',
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    date: {
        type: Date,
        required: true,
    },
    totalMarks: {
        type: Number,
        required: true,
        min: 1,
    },
    status: {
        type: String,
        enum: ['UPCOMING', 'ACTIVE', 'COMPLETED'],
        default: 'UPCOMING',
    },
    questionCount: {
        type: Number,
        default: 5,
    },
}, {
    timestamps: true,
});
export const Assessment = model('Assessment', AssessmentSchema);
