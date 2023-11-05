import { Module } from '@nestjs/common';
import { BalanceController } from './BalanceController';
import { BalanceService } from './BalanceService';
import { TypeOrmModule } from '@nestjs/typeorm';
import BuyInvestmentTransaction from '../InvestmentTransaction/Entities/BuyInvestmentTransaction';
import SellInvestmentTransaction from '../InvestmentTransaction/Entities/SellInvestmentTransaction';
import { Account } from '../Account/Entities/Account';
import { CurrentAccountService } from '../Auth/CurrentAccountService';
import { MarketDataModule } from '../MarketData/MarketDataModule';

@Module({
  controllers: [BalanceController],
  providers: [BalanceService, CurrentAccountService],
  imports: [
    TypeOrmModule.forFeature([
      BuyInvestmentTransaction,
      SellInvestmentTransaction,
      Account,
    ]),
    MarketDataModule,
  ],
})
export class BalanceModule {}
