import { Controller, Get, Param } from '@nestjs/common';
import { BalanceService } from './BalanceService';
import AssetBalance from './AssetBalance';
import { AvailableCurrenciesList } from '../Money/AvailableCurrenciesList';

@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get('/:accountId')
  findAll(
    //This param is used to set it in CurrentAccountService
    @Param('accountId') accountId: string,
    @Param('currency') currency: AvailableCurrenciesList,
  ): Promise<AssetBalance[]> {
    return this.balanceService.getAllAssetsBalance(currency);
  }
}
