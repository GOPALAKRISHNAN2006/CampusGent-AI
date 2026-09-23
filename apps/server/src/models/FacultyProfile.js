import { Schema, model } from 'mongoose';
const FacultyProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
        index: true,
    },
    employeeId: {
        type: String,
        required: [true, 'Employee ID is required'],
        unique: true,
        trim: true,
    },
    department: {
        type: Schema.Types.ObjectId,
        ref: 'Department',
        required: true,
    },
    assignedSubjects: [{ type: String }],
}, {
    timestamps: true,
});
export const FacultyProfile = model('FacultyProfile', FacultyProfileSchema);
