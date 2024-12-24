import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query } from '@nestjs/common';
import { UserDto } from 'src/dto/users.dto';
import { UsersService } from './users.service';
import { DeleteResult } from 'mongodb';
import { UserDocument } from 'src/models/users.Schema';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post()
  Add(@Body() body: UserDto): Promise<UserDocument> {
    return this.service.Add(body); // Calls the Add method from the service
  }

  @Get()
  FindAll() {
    return this.service.FindAll();
  }

  @Get('/:user_id')
async FindOne(@Param('user_id') user_id: number) {
  const user = await this.service.FindOne(user_id);
  if (!user) {
    throw new NotFoundException(`User with ID ${user_id} not found.`);
  }
  return user;
}

  @Put('/:user_id')
  Update(@Param('user_id') user_id: number, @Body() body: UserDto) {
    return this.service.Update(user_id, body);
  }

  @Delete('/:user_id')
  Delete(@Param('user_id') user_id: number): Promise<DeleteResult> {
    return this.service.Delete(user_id);
  }
  

  @Post('/search')
  Search(@Query('user_id') user_id: number) {
    return this.service.Search(user_id); // Pass both key and user_id to the service
  }

  @Get('/enrolled-in-instructor-courses/:instructor_id')
  async GetEnrolledStudents(@Param('instructor_id') instructor_id: string) {
    return this.service.GetEnrolledStudents(instructor_id);
  }

  @Post('/faker')
  Faker() {
    return this.service.Faker();
  }

  
}
