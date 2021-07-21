import { ChattingsGateway } from './chattings.gateway';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chatting, ChattingSchema } from './models/chattings.model';
import { Socket as SocketModel, SocketSchema } from './models/sockets.model';
import { ChattingsController } from './chattings.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chatting.name, schema: ChattingSchema },
      { name: SocketModel.name, schema: SocketSchema },
    ]),
  ],
  controllers: [ChattingsController],
  providers: [ChattingsGateway],
  exports: [ChattingsGateway],
})
export class ChattingsModule {}
