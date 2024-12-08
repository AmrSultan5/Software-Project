import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NoteDto } from 'src/dto/notes.dto';

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

  @Get('/:id')
  OneNote(@Param('id') id: string) {
    return this.service.OneNote(id);
  }

  @Put('/:id')
  UpdateNote(@Param('id') id: string, @Body() body: NoteDto) {
    return this.service.UpdateNote(id, body);
  }

  @Delete('/:id')
  DeleteNote(@Param('id') id: string) {
    return this.service.DeleteNote(id);
  }

  @Post('/search')
  Search(@Query('key') key: string) {
    return this.service.Search(key);
  }
}
