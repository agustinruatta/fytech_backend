import { Controller, Get, Param } from '@nestjs/common';
import { BalanceService } from './BalanceService';

@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get('/:accountId')
  findAll(@Param('accountId') accountId: string) {
    return this.balanceService.getAllAssetsBalance();
  }
}
