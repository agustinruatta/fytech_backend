import { Module } from '@nestjs/common';
import { InvestmentTransactionController } from './InvestmentTransactionController';
import { InvestmentTransactionService } from './InvestmentTransactionService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentUserService } from '../Auth/CurrentUserService';
import { Account } from '../Account/Entities/Account';
import BuyInvestmentTransaction from './Entities/BuyInvestmentTransaction';
import SellInvestmentTransaction from './Entities/SellInvestmentTransaction';
import { InvestmentTransaction } from './Entities/InvestmentTransaction';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BuyInvestmentTransaction,
      SellInvestmentTransaction,
      InvestmentTransaction,
      Account,
    ]),
  ],
  controllers: [InvestmentTransactionController],
  providers: [InvestmentTransactionService, CurrentUserService],
})
export class InvestmentTransactionModule {}
