import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Courses,CourseSchema } from 'src/models/courses.Schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Courses.name, schema: CourseSchema}])], 
  controllers: [CoursesController],
  providers: [CoursesService]
})
export class CoursesModule {}
