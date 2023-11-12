import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDTO } from './DTO/CreateUserDTO';
import { UsersService } from './UsersService';
import { Public } from '../Auth/PublicRouteDecorator';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Public()
  @Post()
  async create(@Body() createUserDTO: CreateUserDTO) {
    const user = await this.userService.createUser(
      createUserDTO.email,
      createUserDTO.password,
      createUserDTO.defaultAccountName,
    );

    return {
      user: await user.serialize(),
      defaultAccount: await (await user.accounts)[0].serialize(),
    };
  }
}
