import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { Account } from '../Account/Entities/Account';
import { CurrentUserService } from '../Auth/CurrentUserService';
import { InvalidArgumentException } from '../Shared/Exceptions/InvalidArgumentException';
import BuyInvestmentTransaction from '../InvestmentTransaction/Entities/BuyInvestmentTransaction';
import SellInvestmentTransaction from '../InvestmentTransaction/Entities/SellInvestmentTransaction';

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(Account)
    public readonly accountRepository: Repository<Account>,
    @InjectRepository(BuyInvestmentTransaction)
    private readonly buyInvestmentTransactionRepository: Repository<BuyInvestmentTransaction>,
    @InjectRepository(SellInvestmentTransaction)
    private readonly sellInvestmentTransactionRepository: Repository<SellInvestmentTransaction>,
    public readonly currentUserService: CurrentUserService,
  ) {}

  async getAllAssetsBalance(accountId: string) {
    let account;

    try {
      account = await this.accountRepository.findOneByOrFail({
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
            ' not found',
          "You don't have permissions to use provided account id",
        );
      }

      throw exception;
    }

    return {};
  }
}
