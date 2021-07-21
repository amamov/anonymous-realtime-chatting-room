import { IsNotEmpty, IsString } from 'class-validator';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaOptions, Types } from 'mongoose';

const options: SchemaOptions = {
  collection: 'chattings',
  timestamps: true,
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
};

@Schema(options)
export class Chatting extends Document {
  @Prop({
    type: {
      _id: { type: Types.ObjectId, required: true, ref: 'sockets' },
      id: { type: String },
      username: { type: String, required: true },
    },
  })
  @IsNotEmpty()
  @IsString()
  user: string;

  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  message: string;
}

export const ChattingSchema = SchemaFactory.createForClass(Chatting);
