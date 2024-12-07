import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ProgressService } from './progressService';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}


  
  @Get('/students/:id')
  async getStudentProgress(@Param('id') studentId: string) {
    return this.progressService.getStudentProgress(studentId);
  }

  
  @Post('/students/:id/courses/:courseId')
  async updateStudentProgress(
    @Param('id') studentId: string,
    @Param('courseId') courseId: string,
    @Body() updateData: any,
  ) {
    return this.progressService.updateStudentProgress(studentId, courseId, updateData);
  }

  @Get('/instructors/:id')
  async getInstructorAnalytics(@Param('id') instructorId: string) {
    return this.progressService.getInstructorAnalytics(instructorId);
  }
}
