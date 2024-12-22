import MongooseScheme from 'mongoose';
import {Prop , Schema , SchemaFactory} from '@nestjs/mongoose';
import { Courses } from './courses.Schema';
import { Document } from 'mongoose';

export type UserDocument = users & Document;


@Schema({timestamps: true})
export class users{
    @Prop({required: true, unique: true})
    user_id: number;

    @Prop({required: true})
    name: string;
     
    @Prop({required: true , unique: true})
    email: string;

    @Prop({required: true })
    password: string;

    @Prop ({required: true , enum: ['student', 'instructor','admin']})
    role: string;

    @Prop ({type: MongooseScheme.Types.ObjectId, ref: 'courses'})
    coursesTaught?: Courses[];

    @Prop ({type: MongooseScheme.Types.ObjectId, ref: 'courses'})
    coursesEnrolled?: Courses[];

    @Prop()
    profile_picture_url?: string;

    @Prop({ type: Date})
    createdAt?: Date;

    @Prop()
    mfaSecret?: string;

}
export const UserSchema = SchemaFactory.createForClass(users);

UserSchema.set('toJSON', {
    transform: (doc, ret) => {
      ret.id = ret._id; // Optionally map _id to id
      delete ret._id; // Remove _id if not needed
      delete ret.__v; // Remove __v field from the response
      return ret;
    },
  });