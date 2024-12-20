import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
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
  FindOne(@Param('user_id') user_id: string) {
    return this.service.FindOne(user_id);
  }

  @Put('/:user_id')
  Update(@Param('user_id') user_id: string, @Body() body: UserDto) {
    return this.service.Update(user_id, body);
  }

  @Delete('/:user_id')
  Delete(@Param('user_id') user_id: string): Promise<DeleteResult> {
    return this.service.Delete(user_id);
  }

  @Post('/search')
  Search(@Query('key') key: string, @Query('user_id') user_id?: string) {
    return this.service.Search(key, user_id); // Pass both key and user_id to the service
  }

  @Post('/faker')
  Faker() {
    return this.service.Faker();
  }
}
