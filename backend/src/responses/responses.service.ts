import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ResponseDto } from 'src/dto/responses.dto';
import { responses } from 'src/models/responses.schema';
import { ResponseDocument } from 'src/models/responses.schema';
import { DeleteResult } from 'mongodb';
@Injectable()
export class ResponsesService {

    constructor(@InjectModel(responses.name) private responseModel: Model<ResponseDocument>){}

    Add(body: ResponseDto) {
        return this.responseModel.create(body);
    }

    FindAll(){
        return this.responseModel.find();
    } 

    FindOne(user_Id: Types.ObjectId, quiz_id: Types.ObjectId) {
        return this.responseModel.findOne({ user_Id, quiz_id });
      }

      Update(user_Id: Types.ObjectId, quiz_id: Types.ObjectId, body: ResponseDto) {
        return this.responseModel.findOneAndUpdate(
          { user_Id, quiz_id },
          { $set: body },
          { new: true }
        );
      }

      Delete(user_Id: Types.ObjectId, quiz_id: Types.ObjectId): Promise<DeleteResult> {
        return this.responseModel.deleteOne({user_Id, quiz_id}).exec();
    }

    Search(key: string): Promise<ResponseDocument[]> {

        const query = {
            $or: [
              { response_id: { $regex: key, $options: 'i' } },
              { user_Id: { $regex: key, $options: 'i' } },
              { quiz_Id: { $regex: key, $options: 'i' } },
              { answers: { $regex: key, $options: 'i' } },
              { score: { $regex: key, $options: 'i' } },
              { submitted_at: { $regex: key, $options: 'i' } },
            ],
          };

          return this.responseModel.find(query).exec();
        }
}
