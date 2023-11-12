import { Inject, Injectable, Scope } from '@nestjs/common';
import { User } from '../Users/Entities/User';
import { REQUEST } from '@nestjs/core';
import { Account } from '../Account/Entities/Account';
import { InvalidArgumentException } from '../Shared/Exceptions/InvalidArgumentException';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable({ scope: Scope.REQUEST })
export default class CurrentUserService {
  private currentUser: User | undefined | null = undefined;
  private currentAccount: Account | undefined | null = undefined;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject(REQUEST)
    private readonly request: Request,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getCurrentUserOrFail(): Promise<User> {
    const currentUser = await this.getCurrentUser();

    if (!currentUser) {
      throw new InvalidArgumentException(
        'Trying to get current user but is not provided',
        'Can not found a user with provided JWT',
      );
    }

    return currentUser;
  }

  async getCurrentUser(): Promise<User | null> {
    //If current user has not been calculated yet
    if (this.currentUser === undefined) {
      try {
        const userData: { email: string } = this.jwtService.verify(
          this.extractTokenFromHeader(this.request),
          {
            secret: this.configService.get<string>('JWT_SECRET'),
          },
        );

        this.currentUser = await this.userRepository.findOneBy({
          email: userData.email,
        });
      } catch (e) {
        this.currentUser = null;
      }
    }

    return this.currentUser;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async getCurrentAccountOrFail(): Promise<Account> {
    const currentAccount = await this.getCurrentAccount();

    if (!currentAccount) {
      throw new InvalidArgumentException(
        'Trying to get current account but is not provided',
        "You don't have permissions to use provided account id",
      );
    }

    return currentAccount;
  }

  private async getCurrentAccount(): Promise<Account> {
    //If current account has not been calculated yet
    if (this.currentAccount === undefined) {
      //Try to set current account with body or request param
      if (
        typeof this.request.body.accountId !== 'undefined' ||
        typeof this.request.params.accountId !== 'undefined'
      ) {
        this.currentAccount = await this.accountRepository.findOneBy({
          id: this.request.body.accountId || this.request.params.accountId,
          user: {
            id: (await this.getCurrentUserOrFail()).getId(),
          },
        });
      } else {
        this.currentAccount = null;
      }
    }

    return this.currentAccount;
  }
}
