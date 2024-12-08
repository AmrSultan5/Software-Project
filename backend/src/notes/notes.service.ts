import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NoteDto } from 'src/dto/notes.dto';
import { Notes, NoteDocument } from 'src/models/notes.Schema';
import { DeleteResult } from 'mongodb';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Notes.name) private notesModel: Model<NoteDocument>) {}

  CreateNote(body: NoteDto) {
    return this.notesModel.create(body);
  }

  AllNotes() {
    return this.notesModel.find();
  }

  OneNote(id: string) {
    return this.notesModel.findOne({ note_id: id });
  }

  UpdateNote(id: string, body: NoteDto) {
    return this.notesModel.findOneAndUpdate(
      { note_id: id },
      { $set: body },
      { new: true },
    );
  }

  DeleteNote(id: string): Promise<DeleteResult> {
    return this.notesModel.deleteOne({ note_id: id }).exec();
  }

  Search(key: string) {
    const keyword = key
      ? {
          $or: [
            { note_id: { $regex: key, $options: 'i' } },
            { user_id: { $regex: key, $options: 'i' } },
            { course_id: { $regex: key, $options: 'i' } },
            { content: { $regex: key, $options: 'i' } },
          ],
        }
      : {};
    return this.notesModel.find(keyword);
  }
}
