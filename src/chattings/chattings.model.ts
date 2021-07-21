import { IsNotEmpty, IsString } from 'class-validator';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaOptions } from 'mongoose';

const options: SchemaOptions = {
  collection: 'news',
  timestamps: true,
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
};

@Schema(options)
export class Chatting extends Document {
  @Prop({
    unique: true,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  message: string;
}

export const ChattingSchema = SchemaFactory.createForClass(Chatting);
