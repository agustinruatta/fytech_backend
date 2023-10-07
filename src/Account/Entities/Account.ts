import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Serializable from '../../Shared/Serialization/Serializable';
import { User } from '../../Users/Entities/User';
import { InvestmentTransaction } from '../../InvestmentTransaction/Entities/InvestmentTransaction';

@Entity({ name: 'accounts' })
export class Account implements Serializable {
  @PrimaryGeneratedColumn('uuid')
  private id: string | undefined;

  /**
   * This is the account name. It could be a person's name, or maybe a legal/company person
   */
  @Column({ name: 'name' })
  public name: string;

  @ManyToOne(() => User, (user) => user.accounts)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(
    () => InvestmentTransaction,
    (investmentTransaction) => investmentTransaction.account,
  )
  investmentTransactions: InvestmentTransaction[] = [];

  @CreateDateColumn({ name: 'created_at' })
  private createdAt: Date | undefined;

  @UpdateDateColumn({ name: 'updated_at' })
  private updatedAt: Date | undefined;

  constructor(name: string) {
    this.name = name;
  }

  public getId(): string | undefined {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public serialize(): object {
    return {
      name: this.getName(),
    };
  }
}
