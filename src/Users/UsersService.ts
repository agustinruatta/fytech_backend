import { Injectable } from '@nestjs/common';
import { User } from './Entities/User';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvalidArgumentException } from '../Shared/Exceptions/InvalidArgumentException';
import { Account } from '../Account/Entities/Account';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(
    email: string,
    password: string,
    defaultAccountName: string,
  ): Promise<User> {
    if ((await this.userRepository.countBy({ email: email })) > 0) {
      throw new InvalidArgumentException(
        'This email is already associated with another account',
        'This email is already associated with another account',
      );
    }

    const user = new User(email, password);
    user.addAccount(new Account(defaultAccountName));

    return this.userRepository.save(user);
  }
}
