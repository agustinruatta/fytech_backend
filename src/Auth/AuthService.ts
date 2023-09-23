import { Injectable } from '@nestjs/common';
import { User } from '../Users/Entities/User';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import InvalidCredentialsException from '../Shared/Exceptions/InvalidCredentialsException';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findOneBy({ email: email });

    if (!user || !(await user.isValidPassword(password))) {
      throw new InvalidCredentialsException();
    }

    return {
      accessToken: this.jwtService.sign({
        sub: user.getId,
        email: user.getEmail(),
      }),
    };
  }
}
