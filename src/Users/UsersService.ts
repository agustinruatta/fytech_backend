import { Injectable } from '@nestjs/common';
import { User } from './Entities/User';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  createUser(email: string, password: string): User {
    return new User(email, password);
  }
}
