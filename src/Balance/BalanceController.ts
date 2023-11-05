import { Controller, Get, Param } from '@nestjs/common';
import { BalanceService } from './BalanceService';
import AssetBalance from './AssetBalance';
import { AvailableCurrencies } from '../Money/AvailableCurrencies';

@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get('/:accountId/:currency')
  findAll(
    //Don't delete this param because it is used to set it in CurrentAccountService
    @Param('accountId') accountId: string,
    @Param('currency') currency: AvailableCurrencies,
  ): Promise<AssetBalance[]> {
    return this.balanceService.getAllAssetsBalance(currency);
  }
}
