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

  @Get('/instructors/:name')
  async getInstructorAnalytics(@Param('name') name: string) {
    console.log("the Name: ", name );
    return this.progressService.getInstructorAnalytics(name);
  }
  @Get('/students')
  async getAllProgress() {
    return this.progressService.getAllProgress();
  }
}
