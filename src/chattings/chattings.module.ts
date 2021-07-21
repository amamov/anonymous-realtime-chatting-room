import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chatting, ChattingSchema } from './chattings.model';
import { ChattingsController } from './chattings.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chatting.name, schema: ChattingSchema },
    ]),
  ],
  controllers: [ChattingsController],
})
export class ChattingsModule {}
