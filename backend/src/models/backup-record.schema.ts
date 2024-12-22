import { Schema, Document } from 'mongoose';

export interface BackupDocument extends Document {
    backup_id: string;
    fileName: string;
    createdAt: Date;
}

export const BackupSchema = new Schema<BackupDocument>({
    backup_id: { type: String, unique: true, required: true },
    fileName: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, required: true },
});