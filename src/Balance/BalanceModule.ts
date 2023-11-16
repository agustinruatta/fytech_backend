import { Module } from '@nestjs/common';
import { BalanceController } from './BalanceController';
import { BalanceService } from './BalanceService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../Account/Entities/Account';
import { MarketDataModule } from '../MarketData/MarketDataModule';
import { AuthModule } from '../Auth/AuthModule';
import { InvestmentTransaction } from '../InvestmentTransaction/Entities/InvestmentTransaction';
import BalanceRepository from './BalanceRepository';

@Module({
  controllers: [BalanceController],
  providers: [BalanceService, BalanceRepository],
  imports: [
    TypeOrmModule.forFeature([InvestmentTransaction, Account]),
    AuthModule,
    MarketDataModule,
  ],
  exports: [BalanceService],
})
export class BalanceModule {}
