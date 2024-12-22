import { Schema, Document } from 'mongoose';

export const FailedLoginAttemptSchema = new Schema({
  email: { type: String, required: true },
  ipAddress: { type: String, required: true },
  timestamp: { type: Date, required: true, default: Date.now },
});

export interface FailedLoginAttempt extends Document {
  email: string;
  ipAddress: string;
  timestamp: Date;
}