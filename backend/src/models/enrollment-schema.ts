import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EnrollmentDocument = Enrollment & Document;

@Schema({ timestamps: true })
export class Enrollment {
  @Prop({ required: true })
  user_id: string; // The ID of the user enrolling in the course

  @Prop({ required: true })
  course_id: string; // The ID of the course being enrolled in

  @Prop({ default: () => new Date(), immutable: true })
  enrolled_at: Date; // The timestamp when the enrollment occurred

  @Prop({ default: 'active', enum: ['active', 'completed', 'dropped'] })
  status: string; // The status of the enrollment (e.g., active, completed, dropped)

  @Prop({ type: [Object], default: [] })
  progress: { lesson_id: string; completed_at: Date }[]; // Progress for each lesson in the course

  @Prop()
  feedback?: string; // Optional feedback given by the user after completing the course

  @Prop()
  rating?: number; // Optional rating given by the user after completing the course
}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);