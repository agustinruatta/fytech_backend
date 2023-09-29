import { Module } from '@nestjs/common';
import { InvestmentTransactionController } from './InvestmentTransactionController';
import { InvestmentTransactionService } from './InvestmentTransactionService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestmentTransaction } from './Entities/InvestmentTransaction';

@Module({
  imports: [TypeOrmModule.forFeature([InvestmentTransaction])],
  controllers: [InvestmentTransactionController],
  providers: [InvestmentTransactionService],
})
export class InvestmentTransactionModule {}
