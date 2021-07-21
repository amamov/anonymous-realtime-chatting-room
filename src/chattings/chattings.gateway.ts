import { Chatting } from './models/chattings.model';
import { Socket as SocketModel } from './models/sockets.model';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Model } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';

@WebSocketGateway({ namespace: 'chattings' })
export class ChattingsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('chat');

  constructor(
    @InjectModel(Chatting.name) private readonly chattingModel: Model<Chatting>,
    @InjectModel(SocketModel.name)
    private readonly socketModel: Model<SocketModel>,
  ) {}

  afterInit(): void {
    this.logger.log('socket server init');
  }

  handleConnection(@ConnectedSocket() socket: Socket): void {
    this.logger.log(`connected : ${socket.id}`, socket.nsp.name);
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    const user = await this.socketModel.findOne({ id: socket.id });
    socket.broadcast.emit('disconnect_user', user.username);
    this.logger.log(`disconnected : ${socket.id}`, socket.nsp.name);
    await user.delete();
  }

  @SubscribeMessage('new_user')
  async sendConnectedUsername(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const exist = await this.socketModel.exists({ username });
    if (exist) {
      username = `${username}_${uuidV4().slice(0, 5)}`;
      await this.socketModel.create({
        id: socket.id,
        username,
      });
    } else {
      await this.socketModel.create({ id: socket.id, username: username });
    }
    socket.emit('hello_user', username);
    socket.broadcast.emit('user_connected', username);
  }

  @SubscribeMessage('submit_chat')
  async sendNewChat(
    @MessageBody() chat: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const socketObject = await this.socketModel.findOne({ id: socket.id });
    await this.chattingModel.create({
      user: socketObject,
      chat,
    });
    socket.broadcast.emit('new_chat', {
      chat,
      username: socketObject.username,
    });
  }
}
