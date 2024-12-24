// src/users/users.module.ts

import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { users, UserSchema } from 'src/models/users.Schema';
import { Courses, CourseSchema } from 'src/models/courses.schema'; // Import CoursesSchema
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: users.name, schema: UserSchema },
      { name: Courses.name, schema: CourseSchema }, // Register CoursesModel
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
