import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './AuthService';
import SignInDTO from './DTO/SignInDTO';
import { Public } from './PublicRouteDecorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
}
