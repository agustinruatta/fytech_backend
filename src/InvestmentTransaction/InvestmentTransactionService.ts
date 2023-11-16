import { Injectable } from '@nestjs/common';
import { CreateInvestmentTransactionDTO } from './DTO/CreateInvestmentTransactionDTO';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { InvestmentTransaction } from './Entities/InvestmentTransaction';
import CurrentUserService from '../Auth/CurrentUserService';
import { InvalidArgumentException } from '../Shared/Exceptions/InvalidArgumentException';
import SellInvestmentTransaction from './Entities/SellInvestmentTransaction';
import BuyInvestmentTransaction from './Entities/BuyInvestmentTransaction';
import { Account } from '../Account/Entities/Account';
import Money from '../Money/Money';
import { BalanceService } from '../Balance/BalanceService';

@Injectable()
export class InvestmentTransactionService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(InvestmentTransaction)
    private readonly investmentTransactionRepository: Repository<InvestmentTransaction>,
    private readonly balanceService: BalanceService,
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
    const account = await this.accountRepository.findOneBy({
      id: createTransactionDto.accountId,
      user: {
        id: (await this.currentUserService.getCurrentUserOrFail()).getId(),
      },
    });

    if (!account) {
      throw new InvalidArgumentException(
        'Account id ' +
          createTransactionDto.accountId +
          ' and user ' +
          (await this.currentUserService.getCurrentUserOrFail()).getId() +
          'not found',
        "You don't have permissions to use sent account id",
      );
    }

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
      const previousAmount = await this.balanceService.getInstrumentBalance(
        account,
        createTransactionDto.code,
      );

      if (previousAmount < createTransactionDto.amount) {
        throw new InvalidArgumentException(
          'Insufficient quantity for sale. Previous amount: ' + createTransactionDto.amount,
          'Insufficient quantity for sale. Please check your portfolio and enter a valid quantity.',
        );
      }

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
  }
}
