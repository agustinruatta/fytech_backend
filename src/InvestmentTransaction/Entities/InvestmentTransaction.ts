import { Account } from '../../Account/Entities/Account';
import Money from '../../Money/Money';
import Serializable from '../../Shared/Serialization/Serializable';

export abstract class InvestmentTransaction implements Serializable {
  private account: Account;

  private code: string;

  private amount: number;

  private money: Money;

  private datetime: Date;

  protected constructor(
    account: Account,
    code: string,
    amount: number,
    money: Money,
    datetime: Date,
  ) {
    this.account = account;
    this.code = code;
    this.amount = amount;
    this.money = money;
    this.datetime = datetime;
  }

  serialize(): object {
    return {
      code: this.code,
      amount: this.amount,
      money: this.money.serialize(),
      datetime: this.datetime,
      action: this.getAction(),
    };
  }

  protected abstract getAction(): 'buy' | 'sell';
}
