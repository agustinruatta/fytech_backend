import { Controller, Get, Param } from '@nestjs/common';
import { BalanceService } from './BalanceService';
import AssetBalance from './AssetBalance';

@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get('/:accountId')
  findAll(@Param('accountId') accountId: string): Promise<AssetBalance[]> {
    return this.balanceService.getAllAssetsBalance();
  }
}
