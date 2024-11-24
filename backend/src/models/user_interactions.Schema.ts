import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Types} from 'mongoose';

@Schema({ timestamps: true })
export class user_interactions
{
    @Prop({ required: true , unique: true })
    interaction_id: string;

    @Prop({ type: Types.ObjectId, ref: 'users', required: true })
    user_id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'courses', required: true })
    course_id: Types.ObjectId;

    @Prop({required: true})
    score: number;

    @Prop({})
    time_spent_minutes: number;

    @Prop({ default: () => new Date(), required: true })
    last_accessed: Date;
}

export const UserInteractionsSchema = SchemaFactory.createForClass(user_interactions);