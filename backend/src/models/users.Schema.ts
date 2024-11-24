import MongooseScheme from 'mongoose';
import {Prop , Schema , SchemaFactory} from '@nestjs/mongoose';
import { courses } from './courses.Schema';


@Schema({timestamps: true})
export class users{
    @Prop()
    user_id: string;

    @Prop({required: true})
    name: string;
     
    @Prop({required: true , unique: true})
    email: string;

    @Prop({required: true })
    password: string;

    @Prop ({required: true , enum: ['student', 'instructor','admin']})
    role: string;

    @Prop ({type: MongooseScheme.Types.ObjectId, ref: 'courses'})
    coursesTaught?: courses[];

    @Prop ({type: MongooseScheme.Types.ObjectId, ref: 'courses'})
    coursesEnrolled?: courses[];

    @Prop()
    profile_picture_url?: string;

    @Prop({ type: Date})
    createdAt?: Date;

}
export const UserSchema = SchemaFactory.createForClass(users);