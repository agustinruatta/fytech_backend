import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository, Transaction } from 'typeorm';
import { Account } from '../Account/Entities/Account';
import { CurrentUserService } from '../Auth/CurrentUserService';
import { InvalidArgumentException } from '../Shared/Exceptions/InvalidArgumentException';

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly currentUserService: CurrentUserService,
  ) {}

  async getAllAssetsBalance(accountId: string) {
    try {
      const account = await this.accountRepository.findOneByOrFail({
        id: accountId,
        user: {
          id: this.currentUserService.getCurrentUser().getId(),
        },
      });
    } catch (exception) {
      if (exception instanceof EntityNotFoundError) {
        throw new InvalidArgumentException(
          'Account id ' +
            accountId +
            ' and user ' +
            this.currentUserService.getCurrentUser().getId() +
            'not found',
          "You don't have permissions to use provided account id",
        );
      }

      throw exception;
    }
    return {};
  }
}
