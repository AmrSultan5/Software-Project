import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ResponseDocument = responses & Document;

@Schema({ timestamps: true }) 
export class responses {
    @Prop({ required: true , unique: true })
    responses_id: string;

    @Prop({ required: true})
    user_Id: string;

    @Prop({ required: true})
    quiz_Id:string;

    @Prop() 
    answers : object[];

    @Prop()
    score : number;

    @Prop({ type: Date })
    submitted_at: Date;
}

export const ResponsesSchema = SchemaFactory.createForClass(responses);
