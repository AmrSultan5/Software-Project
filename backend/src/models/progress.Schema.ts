import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Document } from 'mongoose';

export type ProgressDocument = Progress & Document;


@Schema({ timestamps: true })
export class Progress {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  courseId: Types.ObjectId;

  @Prop({ type: Number, min: 0, max: 100, required: true })
  completionPercentage: number;

  @Prop({ type: Date, required: true })
  lastAccessed: Date;

  // Engagement Metrics
  @Prop({ type: Number, default: 0 })
  timeSpent: number;

  @Prop({ type: Number, default: 0 })
  loginCount: number;

  // Performance Metrics
  @Prop({ type: Number, default: 0 })
  averageScore: number;

  @Prop({ type: [Number], default: [] })
  quizScores: number[];

  // Completed Modules (Populate with titles)
  @Prop({ type: [Types.ObjectId], ref: 'Module', default: [] })
  completedModules: Types.ObjectId[];
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);

