import { Module } from '@nestjs/common';
import { UsersService } from './UsersService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './Entities/User';
import { UsersController } from './UsersController';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
