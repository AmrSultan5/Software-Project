import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true }) 
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) 
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true }) /
  courseId: Types.ObjectId;

  @Prop({ type: Number, min: 0, max: 100, required: true })
  completionPercentage: number;

  @Prop({ type: Date, required: true }) 
  lastAccessed: Date;
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);
