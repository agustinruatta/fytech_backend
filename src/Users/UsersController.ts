import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDTO } from './DTO/CreateUserDTO';
import { UsersService } from './UsersService';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  create(@Body() createUserDTO: CreateUserDTO) {
    return this.userService.createUser(
      createUserDTO.email,
      createUserDTO.password,
    );
  }
}
