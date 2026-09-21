import { Schema, model, Document, Types } from 'mongoose';

export interface IAIUsage extends Document {
  user: Types.ObjectId;
  feature: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  modelUsed: string;
  createdAt: Date;
}

const AIUsageSchema = new Schema<IAIUsage>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    feature: {
      type: String,
      required: true,
    },
    promptTokens: {
      type: Number,
      default: 0,
    },
    completionTokens: {
      type: Number,
      default: 0,
    },
    totalTokens: {
      type: Number,
      default: 0,
    },
    modelUsed: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const AIUsage = model<IAIUsage>('AIUsage', AIUsageSchema);
