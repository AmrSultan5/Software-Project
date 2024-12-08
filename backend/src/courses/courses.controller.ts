import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
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
    @UseGuards(AuthGuard())
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
}
