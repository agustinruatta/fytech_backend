import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): { status: string } {
    return { status: 'OK' };
  }

  @Get('/ping')
  ping(): { status: string } {
    return { status: 'OK' };
  }

  @Get('/logged-in-ping')
  loggedInPing(): { status: string } {
    return { status: 'OK' };
  }
}
