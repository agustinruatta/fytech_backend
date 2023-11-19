import { Repository } from 'typeorm';
import { InvestmentTransaction } from '../InvestmentTransaction/Entities/InvestmentTransaction';
import Money from '../Money/Money';
import { Account } from '../Account/Entities/Account';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { AvailableCurrencies } from '../Money/AvailableCurrencies';

@Injectable()
export default class BalanceRepository {
  constructor(
    @InjectRepository(InvestmentTransaction)
    private readonly investmentTransactionRepository: Repository<InvestmentTransaction>,
  ) {}

  async getAccountBalance(account: Account): Promise<
    {
      code: string;
      amount: number;
      balance: Money;
    }[]
  > {
    const queryResult: Promise<
      [
        {
          code: string;
          amount: string;
          money_currency: AvailableCurrencies;
          money_cents: string;
        },
      ]
    > = this.investmentTransactionRepository
      .createQueryBuilder('investmentTransaction')
      .select(
        "code, money_currency, sum(case when type = 'BuyInvestmentTransaction' then amount else -amount end) as amount, sum(case when type = 'BuyInvestmentTransaction' then money_cents else -money_cents end) as money_cents",
      )
      .where('investmentTransaction.account = :currentAccount', {
        currentAccount: account.getId(),
      })
      .groupBy('code, money_currency')
      .execute();

    return queryResult.then((rows) =>
      rows.map((row) => {
        return {
          code: row.code,
          amount: parseFloat(row.amount),
          balance: new Money(parseInt(row.money_cents), row.money_currency),
        };
      }),
    );
  }

  async getInstrumentAmount(
    account: Account,
    instrumentCode: string,
  ): Promise<number> {
    const balance = await this.investmentTransactionRepository
      .createQueryBuilder('investmentTransaction')
      .select(
        "sum(case when type = 'BuyInvestmentTransaction' then amount else -amount end) as amount",
      )
      .where(
        'investmentTransaction.account = :currentAccount AND investmentTransaction.code = :code',
        {
          currentAccount: account.getId(),
          code: instrumentCode,
        },
      )
      .groupBy('code')
      .limit(1)
      .execute();

    return balance.length === 0 ? 0 : parseFloat(balance[0].amount);
  }
}
