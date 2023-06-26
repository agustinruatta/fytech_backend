import { Controller, Get, Param } from '@nestjs/common';
import { MarketDataService } from './MarketDataService';

@Controller('market-data')
export class MarketDataController {
  constructor(private readonly marketDataService: MarketDataService) {}

  @Get('/current/:code')
  findOne(@Param('code') code: string) {
    return this.marketDataService.getCurrentMarketData(code);
  }
}
