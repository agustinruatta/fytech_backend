import { Module } from '@nestjs/common';
import { InvestmentTransactionController } from './InvestmentTransactionController';
import { InvestmentTransactionService } from './InvestmentTransactionService';

@Module({
  controllers: [InvestmentTransactionController],
  providers: [InvestmentTransactionService],
})
export class InvestmentTransactionModule {}
