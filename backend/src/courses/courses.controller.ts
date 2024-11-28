import { Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CoursesService } from './courses.service';

@Controller('courses')
export class CoursesController 
{
    constructor(private readonly service: CoursesService){};

    @Post()
    CreateCourse()
    {
        return "Course Added";
    }

    @Get()
    AllCourses()
    {
        return "All Courses";
    }

    @Get('/:id')
    OneCourse(@Param('id') id:string)
    {
        return id;
    }

    @Put('/:id')
    UpdateCourse(@Param('id') id:string)
    {
        return id;
    }

    @Delete('/:id')
    DeleteCourse(@Param('id') id:string)
    {
        return id;
    }

    @Post('/search')
    Search(@Query('key') key)
    {
        return key;
    }
}
