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

@WebSocketGateway({ namespace: 'chattings' })
export class ChattingsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('chat');
  public tempData = {};

  constructor(
    @InjectModel(Chatting.name) private readonly chattingModel: Model<Chatting>,
    @InjectModel(SocketModel.name)
    private readonly socketModel: Model<SocketModel>,
  ) {}

  afterInit(): void {
    this.logger.log('socket server init');
  }

  handleConnection(@ConnectedSocket() socket: Socket): void {
    this.logger.log('connected', socket.nsp.name);
    socket.emit('hello', socket.nsp.name);
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log('disconnected', socket.nsp.name);
    await this.socketModel.findOneAndDelete({ id: socket.id });
  }

  @SubscribeMessage('new_user')
  async sendConnectedUsername(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const exist = await this.chattingModel.exists({ username });
    if (exist) socket.emit('already_exists', 'This strainger already exists.');
    else {
      await this.socketModel.create({ id: socket.id, username: username });
      this.tempData[socket.id] = username;
      socket.broadcast.emit('user_connected', username);
    }
  }

  @SubscribeMessage('submit_chat')
  async sendNewChat(
    @MessageBody() chat: string,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.broadcast.emit('new_chat', {
      chat,
      username: this.tempData[socket.id],
    });
  }

  @SubscribeMessage('get_chatting')
  async handleChattings(@ConnectedSocket() socket: Socket) {
    const chattings = await this.chattingModel.find({});
    socket.emit('load_chatting', chattings);
  }
}
