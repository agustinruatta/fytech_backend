import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { Account } from '../Account/Entities/Account';
import { CurrentUserService } from '../Auth/CurrentUserService';
import { InvalidArgumentException } from '../Shared/Exceptions/InvalidArgumentException';
import BuyInvestmentTransaction from '../InvestmentTransaction/Entities/BuyInvestmentTransaction';
import SellInvestmentTransaction from '../InvestmentTransaction/Entities/SellInvestmentTransaction';

interface AssetBalance {
  type: 'stock' | 'crypto';
  code: string;
  amount: number;
  balance: {
    currency: string;
    floatValue: number;
  };
}

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

  async getAllAssetsBalance(accountId: string): Promise<AssetBalance[]> {
    try {
      const account = await this.accountRepository.findOneByOrFail({
        id: accountId,
        user: {
          id: this.currentUserService.getCurrentUser().getId(),
        },
      });

      const buyTransactions =
        await this.buyInvestmentTransactionRepository.findBy({});
      const sellTransactions =
        await this.sellInvestmentTransactionRepository.findBy({});

      const amounts = {};

      buyTransactions.forEach((buyTransaction) => {
        if (amounts[buyTransaction.getCode()]) {
          amounts[buyTransaction.getCode()] += buyTransaction.getAmount();
        } else {
          amounts[buyTransaction.getCode()] = buyTransaction.getAmount();
        }
      });

      sellTransactions.forEach(
        (buyTransaction) =>
          (amounts[buyTransaction.getCode()] -= buyTransaction.getAmount()),
      );

      const result: AssetBalance[] = [];

      for (const instrumentCode in amounts) {
        result.push({
          type: 'stock',
          code: instrumentCode,
          amount: amounts[instrumentCode],
          balance: {
            currency: 'USD',
            floatValue: 100,
          },
        });
      }

      return result;
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
  }
}
