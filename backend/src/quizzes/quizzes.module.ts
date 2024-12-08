import { Module } from '@nestjs/common';
import { QuizController } from './quizzes.controller';
import { QuizService } from './quizzes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Quiz, QuizSchema } from 'src/models/quizzes.schema';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Quiz.name, schema: QuizSchema }]), // Register Quiz schema
    PassportModule.register({ defaultStrategy: 'jwt' }), // Import PassportModule with the default strategy
  ],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizzesModule {}