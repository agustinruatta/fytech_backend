import { Module } from '@nestjs/common';
import { AuthController } from './AuthController';
import { AuthService } from './AuthService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../Users/Entities/User';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './AuthGuard';
import { APP_GUARD } from '@nestjs/core';

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
    JwtModule.register({
      global: true,
      secret: 'TODO_CHANGE',
      signOptions: { expiresIn: '60s' },
    }),
  ],
})
export class AuthModule {}
