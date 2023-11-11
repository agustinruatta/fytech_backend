import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './PublicRouteDecorator';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../Users/Entities/User';
import { Repository } from 'typeorm';
import { CurrentUserService } from './CurrentUserService';
import { Account } from '../Account/Entities/Account';
import { CurrentAccountService } from './CurrentAccountService';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly currentAccountService: CurrentAccountService,
    private readonly currentUserService: CurrentUserService,
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private configService: ConfigService,
    @InjectRepository(Account)
    public readonly accountRepository: Repository<Account>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const userData: { email: string } = await this.jwtService.verifyAsync(
        token,
        {
          secret: this.configService.get<string>('JWT_SECRET'),
        },
      );

      //TODO: There is a possible vulnerability if in the middle another user set this email as own
      const currentUser = await this.userRepository.findOneByOrFail({
        email: userData.email,
      });

      this.currentUserService.setCurrentUser(currentUser);

      //If there is an accountId parameter, try to set current account
      if (
        typeof request.body.accountId !== 'undefined' ||
        typeof request.params.accountId !== 'undefined'
      ) {
        const account = await this.accountRepository.findOneBy({
          id: request.body.accountId || request.params.accountId,
          user: {
            id: currentUser.getId(),
          },
        });

        if (account) {
          this.currentAccountService.setCurrentAccount(account);
        }
      }
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
