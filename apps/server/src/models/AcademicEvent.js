import { Schema, model } from 'mongoose';

const AcademicEventSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Event title is required'],
        trim: true,
    },
    description: {
        type: String,
        default: '',
        trim: true,
    },
    date: {
        type: Date,
        required: [true, 'Event date is required'],
    },
    endDate: {
        type: Date,
    },
    type: {
        type: String,
        enum: ['EXAM', 'ACADEMIC', 'HOLIDAY', 'SYSTEM', 'SEMINAR', 'WORKSHOP'],
        default: 'ACADEMIC',
        required: true,
    },
    department: {
        type: Schema.Types.ObjectId,
        ref: 'Department',
        default: null, // null represents institution-wide
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});

AcademicEventSchema.index({ date: 1, department: 1 });
AcademicEventSchema.index({ type: 1, date: 1 });

export const AcademicEvent = model('AcademicEvent', AcademicEventSchema);
