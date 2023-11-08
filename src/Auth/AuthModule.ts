import { Module } from '@nestjs/common';
import { AuthController } from './AuthController';
import { AuthService } from './AuthService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../Users/Entities/User';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './AuthGuard';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Account } from '../Account/Entities/Account';
import { CurrentUserService } from './CurrentUserService';
import { CurrentAccountService } from './CurrentAccountService';

function throwNoJwtKeyException(): any {
  throw new Error('JWT_SECRET environment variable not found');
}

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    CurrentAccountService,
    CurrentUserService,
  ],
  imports: [
    TypeOrmModule.forFeature([Account, User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret:
          configService.get<string>('JWT_SECRET') || throwNoJwtKeyException(),
        signOptions: { expiresIn: '7 day' },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AuthModule {}
