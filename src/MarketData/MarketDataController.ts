import { Controller, Get, Param } from '@nestjs/common';
import { MarketDataService } from './MarketDataService';
import { GetCurrentMarketDataResponse } from './dto/GetCurrentMarketDataResponse';

@Controller('market-data')
export class MarketDataController {
  constructor(private readonly marketDataService: MarketDataService) {}

  @Get('/current/:code')
  findOne(@Param('code') code: string): Promise<GetCurrentMarketDataResponse> {
    return this.marketDataService.getCurrentMarketData(code);
  }
}
