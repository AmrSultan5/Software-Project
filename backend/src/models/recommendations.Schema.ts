import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Types} from 'mongoose';

@Schema({ timestamps: true })
export class recommendations
{
    @Prop({ required: true , unique: true })
    recommendation_id: string;
    
    @Prop({ type: Types.ObjectId, ref: 'users', required: true })
    user_id: Types.ObjectId;

    @Prop({ type: [String], required: true })
    recommended_items: string[];

    @Prop({ type: Date, required: true })
    generated_at: Date;
}

export const RecommendationsSchema = SchemaFactory.createForClass(recommendations);