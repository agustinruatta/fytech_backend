import { Module } from '@nestjs/common';
import { BalanceController } from './BalanceController';
import { BalanceService } from './BalanceService';
import { TypeOrmModule } from '@nestjs/typeorm';
import BuyInvestmentTransaction from '../InvestmentTransaction/Entities/BuyInvestmentTransaction';
import SellInvestmentTransaction from '../InvestmentTransaction/Entities/SellInvestmentTransaction';
import { Account } from '../Account/Entities/Account';
import { CurrentUserService } from '../Auth/CurrentUserService';

@Module({
  controllers: [BalanceController],
  providers: [BalanceService, CurrentUserService],
  imports: [
    TypeOrmModule.forFeature([
      BuyInvestmentTransaction,
      SellInvestmentTransaction,
      Account,
    ]),
  ],
})
export class BalanceModule {}
