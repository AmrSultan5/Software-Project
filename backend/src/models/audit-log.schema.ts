import { Schema, Document } from 'mongoose';

export const AuditLogSchema = new Schema({
  userEmail: { type: String, required: true },
  activity: { type: String, required: true },
  timestamp: { type: Date, required: true, default: Date.now },
});

export interface AuditLog extends Document {
  userEmail: string;
  activity: string;
  timestamp: Date;
}