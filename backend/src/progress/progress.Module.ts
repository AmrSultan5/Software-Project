import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Progress, ProgressSchema } from 'src/models/progress.Schema';
import { ProgressService } from './progressService';
import { ProgressController } from './progressController';
import { Courses, CourseSchema } from 'src/models/courses.Schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Progress.name, schema: ProgressSchema },
      { name: Courses.name, schema: CourseSchema },
    ]),
  ],
  controllers: [ProgressController],
  providers: [ProgressService],
  exports: [ProgressService],
})
export class ProgressModule {}
