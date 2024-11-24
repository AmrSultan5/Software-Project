import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

// Quiz Session Schema
@Schema({ timestamps: true })
export class QuizSession {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId; // Reference to the user taking the quiz

  @Prop({ type: Types.ObjectId, ref: 'Quiz', required: true })
  quiz_id: Types.ObjectId; // Reference to the quiz being attempted

  @Prop([{
    question_id: Types.ObjectId, // The ID of the question
    user_answer: String, // The answer the user selected
    is_correct: Boolean, // Whether the user's answer is correct
    score: Number, // The score for this question
    feedback: String // Real-time feedback (correct or incorrect)
  }])
  answers: {
    question_id: Types.ObjectId;
    user_answer: string;
    is_correct: boolean;
    score: number;
    feedback: string;
  }[];

  @Prop({ type: Number, default: 0 })
  total_score: number; // Total score for the quiz session

  @Prop({ type: Date, default: Date.now })
  started_at: Date; // When the quiz session started

  @Prop({ type: Date })
  completed_at: Date; // When the quiz session was completed

  @Prop({ type: Boolean, default: false })
  is_completed: boolean; // Whether the user has completed the quiz
}

export const QuizSessionSchema = SchemaFactory.createForClass(QuizSession);
