import { Injectable } from '@nestjs/common';
import { User } from './Entities/User';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvalidArgumentException } from '../Shared/Exceptions/InvalidArgumentException';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(email: string, password: string): Promise<User> {
    if ((await this.userRepository.countBy({ email: email })) > 0) {
      throw new InvalidArgumentException(
        'This email is already associated with another account',
        'This email is already associated with another account',
      );
    }

    return this.userRepository.save(new User(email, password));
  }
}
