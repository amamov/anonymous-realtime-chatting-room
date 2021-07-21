import * as socket from 'socket.io';
import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class ChattingsController {
  @Get()
  @Render('index')
  root() {
    return {
      socketio: socket,
      isOk: true,
      data: { title: 'Anonymous Chat', developer: ['Yoon', 'Sang', 'Seok'] },
    };
  }
}
