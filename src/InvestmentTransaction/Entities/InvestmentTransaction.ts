import { Account } from '../../Account/Entities/Account';
import Money from '../../Money/Money';
import Serializable from '../../Shared/Serialization/Serializable';
import {
  Column,
  CreateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class InvestmentTransaction implements Serializable {
  @PrimaryGeneratedColumn('uuid')
  private id: string | undefined;

  @ManyToOne(() => Account, (account) => account.investmentTransactions)
  account: Account;

  @Column({ name: 'code' })
  private readonly code: string;

  @Column({ name: 'amount' })
  private readonly amount: number;

  @Column({ name: 'money' })
  private money: Money;

  @Column({ name: 'datetime' })
  private readonly datetime: Date;

  @CreateDateColumn({ name: 'created_at' })
  private createdAt: Date | undefined;

  @UpdateDateColumn({ name: 'updated_at' })
  private updatedAt: Date | undefined;

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
