import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Quiz {
  @Prop({ required: true, unique: true })
  quiz_id: string;

  @Prop({ required: true })
  module_id: string;

  @Prop({ required: true, type: [{ question_text: String, options: [String], correct_answer: String }] })
  questions: { question_text: string, options: string[], correct_answer: string }[];

  @Prop({ required: true })
  created_at: Date;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);