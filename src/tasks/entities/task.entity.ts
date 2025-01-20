/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../../users/entities/user.entity';

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
    @Prop({ required: true })
    title: string;
  
    @Prop({ required: true })
    description: string;
  
    @Prop({ required: true })
    dueDate: number;

    @Prop({ required: true })
    status: number; // 0 - Inactive, 1 - Pending, 2 - inProgress, 3 - Completed

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User;
}

export const TaskSchema = SchemaFactory.createForClass(Task);