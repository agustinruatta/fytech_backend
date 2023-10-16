import { Module } from '@nestjs/common';
import { BalanceController } from './BalanceController';
import { BalanceService } from './BalanceService';

@Module({
  controllers: [BalanceController],
  providers: [BalanceService],
})
export class BalanceModule {}
