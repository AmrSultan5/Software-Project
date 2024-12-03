import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CourseDto } from 'src/dto/courses.dto';

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

    @Post('/search')
    Search(@Query('key') key)
    {
        return this.service.Search(key);
    }
}
