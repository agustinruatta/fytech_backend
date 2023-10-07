import { Account } from '../../Account/Entities/Account';
import Money from '../../Money/Money';
import Serializable from '../../Shared/Serialization/Serializable';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  TableInheritance,
  UpdateDateColumn,
} from 'typeorm';
import { InvalidArgumentException } from '../../Shared/Exceptions/InvalidArgumentException';

@Entity({ name: 'investment_transactions' })
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class InvestmentTransaction implements Serializable {
  @PrimaryGeneratedColumn('uuid')
  private id: string | undefined;

  @ManyToOne(() => Account, (account) => account.investmentTransactions)
  account: Account;

  @Column({ name: 'code' })
  private code: string;

  @Column({ name: 'amount' })
  private amount: number;

  @Column(() => Money)
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
    this.setCode(code);
    this.setAmount(amount);
    this.money = money;
    this.datetime = datetime;
  }

  private setCode(code: string) {
    if (code.trim() === '') {
      throw new InvalidArgumentException(
        'Code must not be empty',
        'Code must not be empty',
      );
    }

    this.code = code;
  }

  private setAmount(amount: number) {
    if (amount < 0) {
      throw new InvalidArgumentException(
        'Amount must be greater or equal than 0',
        'Amount must be greater or equal than 0',
      );
    }

    this.amount = amount;
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
