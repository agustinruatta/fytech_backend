import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDTO } from './DTO/CreateUserDTO';
import { UsersService } from './UsersService';
import { Public } from '../Auth/PublicRouteDecorator';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Public()
  @Post()
  create(@Body() createUserDTO: CreateUserDTO) {
    return this.userService.createUser(
      createUserDTO.email,
      createUserDTO.password,
    );
  }
}
