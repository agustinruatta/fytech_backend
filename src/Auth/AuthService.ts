import { Injectable } from '@nestjs/common';
import { User } from '../Users/Entities/User';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import InvalidCredentialsException from '../Shared/Exceptions/InvalidCredentialsException';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async signIn(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: email });

    if (!user || !(await user.isValidPassword(password))) {
      throw new InvalidCredentialsException();
    }

    return user;
  }
}
