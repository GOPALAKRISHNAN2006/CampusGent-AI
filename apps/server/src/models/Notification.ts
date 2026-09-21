import { Schema, model, Document, Types } from 'mongoose';

export interface INotification extends Document {
  recipient: Types.ObjectId;
  type: 'academic' | 'placement' | 'career' | 'AI' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['academic', 'placement', 'career', 'AI', 'system'],
      default: 'system',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Notification = model<INotification>('Notification', NotificationSchema);
