import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Types} from 'mongoose';
import { Document } from 'mongoose';

export type ResponseDocument = responses & Document;

@Schema({ timestamps: true }) 
export class responses {
    @Prop({ required: true , unique: true })
    responses_id: string;

    @Prop({ type: Types.ObjectId, ref: 'users', required: true})
    user_Id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'quizzes', required: true})
    quiz_Id: Types.ObjectId;

    @Prop()
    answers : object[];

    @Prop()
    score : number;

    @Prop({ type: Date })
    submitted_at: Date;
  static schema: any;
}

export const ResponsesSchema = SchemaFactory.createForClass(responses);
