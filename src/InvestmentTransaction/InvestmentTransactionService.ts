import { Injectable } from '@nestjs/common';
import { CreateInvestmentTransactionDTO } from './DTO/CreateInvestmentTransactionDTO';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { InvestmentTransaction } from './Entities/InvestmentTransaction';
import { CurrentUserService } from '../Auth/CurrentUserService';
import { InvalidArgumentException } from '../Shared/Exceptions/InvalidArgumentException';
import SellInvestmentTransaction from './Entities/SellInvestmentTransaction';
import BuyInvestmentTransaction from './Entities/BuyInvestmentTransaction';
import { Account } from '../Account/Entities/Account';
import Money from '../Money/Money';

@Injectable()
export class InvestmentTransactionService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(InvestmentTransaction)
    private readonly investmentTransactionRepository: Repository<InvestmentTransaction>,
    private readonly currentUserService: CurrentUserService,
  ) {}

  async buy(
    createTransactionDto: CreateInvestmentTransactionDTO,
  ): Promise<BuyInvestmentTransaction> {
    return (await this.processTransaction(
      'buy',
      createTransactionDto,
    )) as BuyInvestmentTransaction;
  }

  async sell(
    createTransactionDto: CreateInvestmentTransactionDTO,
  ): Promise<SellInvestmentTransaction> {
    return (await this.processTransaction(
      'sell',
      createTransactionDto,
    )) as SellInvestmentTransaction;
  }

  private async processTransaction(
    action: 'buy' | 'sell',
    createTransactionDto: CreateInvestmentTransactionDTO,
  ): Promise<InvestmentTransaction> {
    try {
      const account = await this.accountRepository.findOneByOrFail({
        id: createTransactionDto.accountId,
        user: {
          id: this.currentUserService.getCurrentUser().getId(),
        },
      });

      let entity: InvestmentTransaction;

      if (action === 'buy') {
        entity = new BuyInvestmentTransaction(
          account,
          createTransactionDto.code,
          createTransactionDto.amount,
          Money.newFromString(
            createTransactionDto.money.amount,
            createTransactionDto.money.currency,
          ),
          createTransactionDto.datetime,
        );
      } else {
        entity = new SellInvestmentTransaction(
          account,
          createTransactionDto.code,
          createTransactionDto.amount,
          Money.newFromString(
            createTransactionDto.money.amount,
            createTransactionDto.money.currency,
          ),
          createTransactionDto.datetime,
        );
      }

      return this.investmentTransactionRepository.save(entity);
    } catch (exception) {
      if (exception instanceof EntityNotFoundError) {
        throw new InvalidArgumentException(
          'Account id ' +
            createTransactionDto.accountId +
            ' and user ' +
            this.currentUserService.getCurrentUser().getId() +
            'not found',
          "You don't have permissions to use sent account id",
        );
      }

      throw exception;
    }
  }
}
