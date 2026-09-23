import { Schema, model } from 'mongoose';
const StudentMarkSchema = new Schema({
    assessmentId: {
        type: Schema.Types.ObjectId,
        ref: 'Assessment',
        required: true,
    },
    student: {
        type: Schema.Types.ObjectId,
        ref: 'StudentProfile',
        required: true,
    },
    marksObtained: {
        type: Number,
        required: true,
        min: 0,
    },
    remarks: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});
export const StudentMark = model('StudentMark', StudentMarkSchema);
