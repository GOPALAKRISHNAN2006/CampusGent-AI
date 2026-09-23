import { Schema, model } from 'mongoose';
const DepartmentSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
    },
    description: {
        type: String,
    },
}, {
    timestamps: true,
});
export const Department = model('Department', DepartmentSchema);
