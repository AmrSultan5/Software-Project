import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ResponseDto } from 'src/dto/responses.dto';
import { responses } from 'src/models/responses.schema';
import { ResponseDocument } from 'src/models/responses.schema';
import { DeleteResult } from 'mongodb';
import { Model } from 'mongoose';
@Injectable()
export class ResponsesService {

    constructor(@InjectModel(responses.name) private responseModel: Model<ResponseDocument>){}

    Add(body: ResponseDto) {
        return this.responseModel.create(body);
    }

    FindAll(){
        return this.responseModel.find();
    } 

    async FindOne(user_Id: string, quiz_Id: string) {
        const data= await this.responseModel.findOne({ user_Id, quiz_Id });
        return {message:"your data is retrieved successfully", data: data}
      }

      Update(user_Id: string, quiz_Id: string, body: ResponseDto) {
        return this.responseModel.findOneAndUpdate(
          { user_Id, quiz_Id },
          { $set: body },
          { new: true }
        );
      } 

      Delete(user_Id: string, quiz_Id: string): Promise<DeleteResult> {
        return this.responseModel.deleteOne({user_Id, quiz_Id}).exec();
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
