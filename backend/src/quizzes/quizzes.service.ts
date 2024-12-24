import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuizDto } from 'src/dto/quizzes.dto';
import { QuizDocument, Quiz } from 'src/models/quizzes.schema';
import { DeleteResult } from 'mongodb';

@Injectable()
export class QuizService {
  constructor(@InjectModel(Quiz.name) private quizModel: Model<QuizDocument>) {}

  createQuiz(body: QuizDto) {
    return this.quizModel.create(body);
  }

  getAllQuizzes() {
    return this.quizModel.find();
  }

  getQuizById(id: string) {
    return this.quizModel.findOne({ quiz_id: id });
  }

  updateQuiz(id: string, body: QuizDto) {
    return this.quizModel.findOneAndUpdate(
      { quiz_id: id },
      { $set: body },
      { new: true },
    );
  }

  deleteQuiz(id: string): Promise<DeleteResult> {
    return this.quizModel.deleteOne({ quiz_id: id }).exec();
  }

  searchQuiz(key: string) {
    const keyword = key ? { quiz_id: { $regex: key, $options: 'i' } } : {};
    return this.quizModel.find(keyword);
  }

  markQuizAsCompleted(quizId: string, userId: string) {
    return this.quizModel.findOneAndUpdate(
      { quiz_id: quizId },
      { $addToSet: { completed_by: userId } },
      { new: true },
    );
  }
}
