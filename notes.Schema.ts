import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true }) 
export class Notes extends Document {
  @Prop({ required: true, unique: true })
  note_id: string; 

  @Prop({ required: true })
  user_id: string; 

  @Prop({ required: false })
  course_id: string;

  @Prop({ required: true })
  content: string; 

  @Prop({ default: () => new Date(), immutable: true })
  created_at: Date; 

  @Prop({ default: () => new Date() })
  last_updated: Date; 
}

export const NotesSchema = SchemaFactory.createForClass(Notes);
