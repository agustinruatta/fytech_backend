import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './AuthService';
import SignInDTO from './DTO/SignInDTO';
import { Public } from './PublicRouteDecorator';
import { CurrentUserService } from './CurrentUserService';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private currentUserService: CurrentUserService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() signInDto: SignInDTO,
  ): Promise<{ access_token: string }> {
    return {
      access_token: (
        await this.authService.signIn(signInDto.email, signInDto.password)
      ).accessToken,
    };
  }

  @Public()
  @Get('/current-user-data')
  currentUserData() {
    return this.currentUserService.getCurrentUser() || {};
  }
}
