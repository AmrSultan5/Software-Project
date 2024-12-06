import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Module {
  @Prop({ required: true, unique: true })
  module_id: string;  // Unique identifier for the module

  @Prop({ required: true })
  course_id: string;  // Associated course ID

  @Prop({ required: true })
  title: string;  // Title of the module

  @Prop({ required: true })
  content: string;  // Content of the module

  @Prop({ type: [String], default: [] })
  resources: string[];  // Array of URLs to additional resources (optional)

  @Prop({ type: Date, default: Date.now })
  created_at: Date;  // Timestamp of module creation
}

export const ModuleSchema = SchemaFactory.createForClass(Module);
