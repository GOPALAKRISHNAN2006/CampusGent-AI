import { Schema, model, Document, Types } from 'mongoose';

export interface IAIInsight extends Document {
  user: Types.ObjectId;
  studentId: string;
  type: string;
  insight: Schema.Types.Mixed; // Structured JSON output from AI
  agent: string;
  agentVersion: string;
  modelUsed: string;
  generatedAt: Date;
  sourceDataVersion: string;
  status: 'ACTIVE' | 'STALE';
  createdAt: Date;
}

const AIInsightSchema = new Schema<IAIInsight>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    studentId: {
      type: String,
      default: function(this: any) { return this.user ? this.user.toString() : ''; },
      index: true,
    },
    type: {
      type: String,
      required: true,
    },
    insight: {
      type: Schema.Types.Mixed,
      required: true,
    },
    agent: {
      type: String,
      default: function(this: any) { return this.type ? this.type.toLowerCase() : 'unknown'; },
    },
    agentVersion: {
      type: String,
      default: '1.0.0',
    },
    modelUsed: {
      type: String,
      default: 'gemini-1.5-flash',
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
    sourceDataVersion: {
      type: String,
      default: 'v1',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'STALE'],
      default: 'ACTIVE',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const AIInsight = model<IAIInsight>('AIInsight', AIInsightSchema);
