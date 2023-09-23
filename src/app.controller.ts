import { Controller, Get } from '@nestjs/common';
import { Public } from './Auth/PublicRouteDecorator';

@Controller()
export class AppController {
  @Public()
  @Get()
  getHello(): { status: string } {
    return { status: 'OK' };
  }

  @Public()
  @Get('/ping')
  ping(): { status: string } {
    return { status: 'OK' };
  }

  @Get('/logged-in-ping')
  loggedInPing(): { status: string } {
    return { status: 'OK' };
  }
}
