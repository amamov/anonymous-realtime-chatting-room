import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'chattings' })
export class ChattingsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('chat');
  public tempData = {};

  @WebSocketServer()
  public server: Server;

  afterInit() {
    this.logger.log('socket server init');
  }

  handleConnection(@ConnectedSocket() socket: Socket): any {
    this.logger.log('connected', socket.nsp.name);
    socket.emit('hello', socket.nsp.name);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket): any {
    this.logger.log('disconnected', socket.nsp.name);
  }

  @SubscribeMessage('new_user')
  handleNewUser(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ): void {
    this.tempData[socket.id] = data;
    socket.broadcast.emit('user_connected', data);
  }

  @SubscribeMessage('submit_chat')
  handleSubmittedChat(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ): void {
    console.log(data);
    socket.broadcast.emit('new_chat', {
      chat: data.data,
      username: this.tempData[socket.id],
    });
  }
}
