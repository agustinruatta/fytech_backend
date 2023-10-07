import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import * as bcrypt from 'bcrypt';
import { InvalidArgumentException } from '../../Shared/Exceptions/InvalidArgumentException';
import Serializable from '../../Shared/Serialization/Serializable';
import { Account } from '../../Account/Entities/Account';

@Entity({ name: 'users' })
export class User implements Serializable {
  private readonly SALT_ROUNDS = 10;

  @PrimaryGeneratedColumn('uuid')
  private id: string | undefined;

  @Column({ name: 'email' })
  public email: string;

  @Column({ name: 'hashed_password' })
  private hashedPassword: string;

  @OneToMany(() => Account, (account) => account.user, { cascade: true })
  accounts: Promise<Account[]> = Promise.resolve([]);

  @CreateDateColumn({ name: 'created_at' })
  private createdAt: Date | undefined;

  @UpdateDateColumn({ name: 'updated_at' })
  private updatedAt: Date | undefined;

  constructor(email: string, password: string) {
    this.setEmail(email);
    this.setPassword(password);
  }

  public getId(): string | undefined {
    return this.id;
  }

  private setEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new InvalidArgumentException('Invalid email', 'Invalid email');
    }

    this.email = email;
  }

  private setPassword(password: string) {
    if (password === undefined) {
      return;
    }

    this.hashedPassword = bcrypt.hashSync(password, this.SALT_ROUNDS);
  }

  public isValidPassword(password: string): Promise<boolean> {
    return bcrypt.compareSync(password, this.hashedPassword);
  }

  public async addAccount(account: Account) {
    (await this.accounts).push(account);
  }

  public getEmail(): string {
    return this.email;
  }

  serialize(): object {
    return {
      email: this.email,
    };
  }
}
