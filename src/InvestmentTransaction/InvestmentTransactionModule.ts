import { Module } from '@nestjs/common';
import { InvestmentTransactionController } from './InvestmentTransactionController';
import { InvestmentTransactionService } from './InvestmentTransactionService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestmentTransaction } from './Entities/InvestmentTransaction';
import { CurrentUserService } from '../Auth/CurrentUserService';

@Module({
  imports: [TypeOrmModule.forFeature([InvestmentTransaction])],
  controllers: [InvestmentTransactionController],
  providers: [InvestmentTransactionService, CurrentUserService],
})
export class InvestmentTransactionModule {}
