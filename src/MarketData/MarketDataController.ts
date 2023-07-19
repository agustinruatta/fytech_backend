import { Controller, Get, Param, Query } from '@nestjs/common';
import { MarketDataService } from './MarketDataService';
import { GetCurrentMarketDataResponse } from './DTO/GetCurrentMarketDataResponse';
import GetCurrentMarketDataRequest from './DTO/GetCurrentMarketDataRequest';

@Controller('market-data')
export class MarketDataController {
  constructor(private readonly marketDataService: MarketDataService) {}

  @Get('/current/:code')
  findOne(
    @Param('code') code: string,
    @Query('currency') currency: string | undefined,
  ): Promise<GetCurrentMarketDataResponse> {
    const request = new GetCurrentMarketDataRequest(code);
    request.currency = currency;

    return this.marketDataService.getCurrentMarketData(request);
  }
}
