import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { QuizService } from './quizzes.service';
import { QuizDto } from 'src/dto/quizzes.dto';

@Controller('quizzes')
export class QuizController {
    constructor(private readonly service: QuizService) {};

    @Post()
    createQuiz(@Body() body: QuizDto) {
        return this.service.createQuiz(body);
    }

    @Get()
    getAllQuizzes() {
        return this.service.getAllQuizzes();
    }

    @Get('/:id')
    getQuizById(@Param('id') id: string) {
        return this.service.getQuizById(id);
    }

    @Put('/:id')
    updateQuiz(@Param('id') id: string, @Body() body: QuizDto) {
        return this.service.updateQuiz(id, body);
    }

    @Delete('/:id')
    deleteQuiz(@Param('id') id: string) {
        return this.service.deleteQuiz(id);
    }

    @Post('/search')
    searchQuiz(@Query('key') key: string) {
        return this.service.searchQuiz(key);
    }
}