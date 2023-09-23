import { Module } from '@nestjs/common';
import { AuthController } from './AuthController';
import { AuthService } from './AuthService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../Users/Entities/User';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './AuthGuard';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';

function throwNoJwtKeyException(): any {
  throw new Error('JWT_KEY environment variable not found');
}

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  imports: [
    TypeOrmModule.forFeature([User]),
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
