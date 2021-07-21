import { Controller, Get, Render } from '@nestjs/common';

@Controller('chatting')
export class ChattingsController {
  @Get()
  @Render('index')
  root() {
    return {
      data: { hello: [{ users: 1 }, { users: 2 }, { users: 3 }, { users: 4 }] },
    };
  }
}
