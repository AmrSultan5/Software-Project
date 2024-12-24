import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { NoteDto } from "src/dto/notes.dto";
import { Notes, NotesDocument } from "src/models/notes.Schema";
import { DeleteResult } from 'mongodb';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Notes.name) private notesModel: Model<NotesDocument>) {}

  CreateNote(body: NoteDto) {
    return this.notesModel.create(body);
  }

  AllNotes() {
    return this.notesModel.find();
  }

  NotesByCourse(course_id: string) {
    return this.notesModel.find({ course_id });
  }

  UpdateNote(id: string, body: NoteDto) {
    return this.notesModel.findByIdAndUpdate(id, { $set: body }, { new: true });
  }

  DeleteNote(id: string): Promise<DeleteResult> {
    return this.notesModel.deleteOne({ _id: id }).exec();
  }  
}