import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CourseDto, SectionDto } from 'src/dto/courses.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('courses')
export class CoursesController 
{
    constructor(private readonly service: CoursesService){};

    @Post()
    CreateCourse(@Body() body: CourseDto)
    {
        return this.service.CreateCourse(body);
    }

    @Get()
    AllCourses()
    {
        return this.service.AllCourses();
    }

    @Get('/:id')
    OneCourse(@Param('id') id:string)
    {
        return this.service.OneCourse(id);
    }

    @Put('/:id')
    UpdateCourse(@Param('id') id:string, @Body() body: CourseDto)
    {
        return this.service.UpdateCourse(id, body);
    }

    @Delete('/:id')
    DeleteCourse(@Param('id') id:string)
    {
        return this.service.DeleteCourse(id);
    }

    @Get('/instructor/:id')
    FindCourse(@Param('id') id:string)
    {
        return this.service.FindCourseByInstructorID(id);
    }

    @Post('/search')
    Search(@Query('key') key)
    {
        return this.service.Search(key);
    }

    @Post('/:id/resources')
    @UseInterceptors(FileInterceptor('file'))
    AddResource(
    @Param('id') courseId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const resource = {
      type: file.mimetype.startsWith('video') ? 'video' : 'pdf',
      url: `http://localhost:5000/uploads/${file.filename}`,
    };
    return this.service.AddResource(courseId, resource);
  }

  @Post('/:id/hierarchy')
  AddHierarchy(@Param('id') courseId: string, @Body() hierarchy: SectionDto[]) {
    return this.service.AddHierarchy(courseId, hierarchy);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/:course_id/enroll')
  async enrollInCourse(@Param('course_id') course_id: string, @Req() req) {
      const user_id = req.user.user_id; // Extract `user_id` from validated JWT
      await this.service.enrollUserInCourse(user_id, course_id);
      return { message: 'Enrolled successfully' };
  }

  @Get('/enrollments/test')
  @UseGuards(AuthGuard('jwt'))
  async getUserEnrollments(@Req() req) {
      const user_id = req.user.user_id;
      console.log("Controller: Fetching enrollments for user_id:", user_id);
  
      const enrollments = await this.service.getUserEnrollments(user_id);
  
      console.log("Controller: Enrollments fetched:", enrollments);
      return enrollments || [];
  }        


}
