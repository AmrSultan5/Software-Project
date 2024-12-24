import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NoteDto } from 'src/dto/notes.dto';
import { DeleteResult } from 'mongodb';

@Controller('notes')
export class NotesController {
  constructor(private readonly service: NotesService) {}

  @Post()
  CreateNote(@Body() body: NoteDto) {
    return this.service.CreateNote(body);
  }

  @Get()
  AllNotes() {
    return this.service.AllNotes();
  }

  @Get('/:course_id')
  NotesByCourse(@Param('course_id') course_id: string) {
    return this.service.NotesByCourse(course_id);
  }

  @Put('/:id')
  UpdateNote(@Param('id') id: string, @Body() body: NoteDto) {
    return this.service.UpdateNote(id, body);
  }

  @Delete('/:id')
  DeleteNote(@Param('id') id: string): Promise<DeleteResult> {
    return this.service.DeleteNote(id);
  }  
}