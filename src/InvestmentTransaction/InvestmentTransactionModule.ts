import { Module } from '@nestjs/common';
import { InvestmentTransactionController } from './InvestmentTransactionController';
import { InvestmentTransactionService } from './InvestmentTransactionService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestmentTransaction } from './Entities/InvestmentTransaction';
import { CurrentUserService } from '../Auth/CurrentUserService';
import { Account } from '../Account/Entities/Account';

@Module({
  imports: [TypeOrmModule.forFeature([InvestmentTransaction, Account])],
  controllers: [InvestmentTransactionController],
  providers: [InvestmentTransactionService, CurrentUserService],
})
export class InvestmentTransactionModule {}
