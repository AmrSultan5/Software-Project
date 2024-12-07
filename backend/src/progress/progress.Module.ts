import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Progress, ProgressSchema } from 'src/models/progress.Schema';
import { ProgressService } from './progressService';
import { ProgressController } from './progressController';
import { CoursesModule } from 'src/courses/courses.module'; 

@Module({
    imports: [
      MongooseModule.forFeature([{ name: Progress.name, schema: ProgressSchema }]),
      CoursesModule, // Ensure this is the correct path to CourseModule
    ],
    controllers: [ProgressController],
    providers: [ProgressService],
  })
  export class ProgressModule {}
