import { InvestmentTransaction } from './InvestmentTransaction';
import { Account } from '../../Account/Entities/Account';
import Money from '../../Money/Money';

export default class BuyInvestmentTransaction extends InvestmentTransaction {
  constructor(
    account: Account,
    code: string,
    amount: number,
    money: Money,
    datetime: Date,
  ) {
    super(account, code, amount, money, datetime);
  }

  protected getAction(): 'buy' | 'sell' {
    return 'buy';
  }
}
