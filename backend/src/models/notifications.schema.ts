import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Notifications {
  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  type: 'reply' | 'update';

  @Prop({ type: Types.ObjectId, ref: 'users', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, default: false })
  isRead: boolean;
}

export const NotificationsSchema = SchemaFactory.createForClass(Notifications);
