import { Module } from '@nestjs/common';
import { InvestmentTransactionController } from './InvestmentTransactionController';
import { InvestmentTransactionService } from './InvestmentTransactionService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../Account/Entities/Account';
import BuyInvestmentTransaction from './Entities/BuyInvestmentTransaction';
import SellInvestmentTransaction from './Entities/SellInvestmentTransaction';
import { InvestmentTransaction } from './Entities/InvestmentTransaction';
import { AuthModule } from '../Auth/AuthModule';
import { BalanceModule } from '../Balance/BalanceModule';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BuyInvestmentTransaction,
      SellInvestmentTransaction,
      InvestmentTransaction,
      Account,
    ]),
    AuthModule,
    BalanceModule,
  ],
  controllers: [InvestmentTransactionController],
  providers: [InvestmentTransactionService],
})
export class InvestmentTransactionModule {}
