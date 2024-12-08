import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CourseDocument = Courses & Document;

@Schema({ timestamps: true })
export class Courses {
  @Prop({ required: true, unique: true })
  course_id: string;

  @Prop({ required: true })
  title: string;

  @Prop({})
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true, enum: ['Beginner', 'Intermediate', 'Advanced'] })
  difficulty_level: string;

  @Prop({ required: true })
  created_by: string;

  @Prop({ default: () => new Date(), immutable: true })
  created_at: Date;

  @Prop({ type: [{ type: Object }], default: [] })
  resources: { type: string; url: string }[];

  @Prop({ type: [{ type: Object }], default: [] })
  hierarchy: {
    section: string;
    lessons: { title: string; content: string }[];
  }[];
}

export const CourseSchema = SchemaFactory.createForClass(Courses);