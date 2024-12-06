import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { ResponseDto } from 'src/dto/responses.dto';
import { Types } from 'mongoose';


@Controller('responses')
export class ResponsesController {
    constructor(private readonly service: ResponsesService) {}

    @Post()
    Add(@Body() body: ResponseDto) {
        return this.service.Add(body);
    }
  
    @Get()
    FindAll(){
        return this.service.FindAll();
    }

    @Get(':user_Id/:quiz_id')
    async findOne(@Param('user_Id') user_Id: Types.ObjectId, @Param('quiz_id') quiz_id: Types.ObjectId) {
      return this.service.FindOne(user_Id, quiz_id);
    }
    

    @Put(':user_Id/:quiz_id')
async Update(
  @Param('user_Id') user_Id: string,
  @Param('quiz_id') quiz_id: string,
  @Body() body: ResponseDto,
) {
  return this.service.Update(user_Id, quiz_id, body);
}


    @Delete('/:user_Id/:quiz_Id')
    Delete(@Param('user_Id') userId: string, @Param('quiz_Id') quizId: string) {
    return this.service.Delete(userId, quizId);
    }

    @Post('/search')
    Search(@Query('key') key)
    {
        return this.service.Search(key);
    }
}