import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotesDocument = Notes & Document;

@Schema({ timestamps: true })
export class Notes {
  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  course_id: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: () => new Date(), immutable: true })
  created_at: Date;

  @Prop({ default: null })
  updated_at: Date;
}

export const NotesSchema = SchemaFactory.createForClass(Notes);