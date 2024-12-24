import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class GroupChats {
  @Prop({ required: true })
  courseId: string;

  @Prop({ required: true, type: [Object] })
  messages: {
    sender: string; // student or instructor
    role: 'student' | 'instructor'; // to differentiate roles
    content: string;
    timestamp: Date;
  }[];
}

export const GroupChatsSchema = SchemaFactory.createForClass(GroupChats);
