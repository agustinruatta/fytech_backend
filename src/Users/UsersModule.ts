import { Module } from '@nestjs/common';
import { UsersService } from './UsersService';

@Module({
  providers: [UsersService],
})
export class UsersModule {}
