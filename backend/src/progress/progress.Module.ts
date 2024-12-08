import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Progress, ProgressSchema } from 'src/models/progress.Schema';
import { ProgressService } from './progressService';
import { ProgressController } from './progressController';
import { CoursesModule } from '../courses/courses.module'; 
import {Courses, CourseSchema} from '../models/courses.Schema'

@Module({
    imports: [
      MongooseModule.forFeature([{ name: Progress.name, schema: ProgressSchema }]),
      MongooseModule.forFeature([{ name: Courses.name, schema: CourseSchema}]),
      CoursesModule
    ],
    controllers: [ProgressController],
    providers: [ProgressService],
    exports: [ProgressService],
  })
  export class ProgressModule {}
