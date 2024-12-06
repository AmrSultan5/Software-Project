import { Module } from '@nestjs/common';
import { QuizController } from './quizzes.controller';
import { QuizService } from './quizzes.service';

@Module({
  controllers: [QuizController],
  providers: [QuizService]
})
export class QuizzesModule {}
