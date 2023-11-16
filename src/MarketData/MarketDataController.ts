import { Controller, Get, Param } from '@nestjs/common';
import { MarketDataService } from './MarketDataService';
import { GetCurrentMarketDataResponse } from './DTO/GetCurrentMarketDataResponse';
import GetCurrentMarketDataRequest from './DTO/GetCurrentMarketDataRequest';
import { Public } from '../Auth/PublicRouteDecorator';
import { AvailableCurrencies } from '../Money/AvailableCurrencies';

@Controller('market-data')
export class MarketDataController {
  constructor(private readonly marketDataService: MarketDataService) {}

  @Public()
  @Get('/current/:code/:currency')
  findOne(
    @Param('code') code: string,
    @Param('currency') currency: AvailableCurrencies,
  ): Promise<GetCurrentMarketDataResponse> {
    return this.marketDataService.getCurrentMarketData(
      GetCurrentMarketDataRequest.new(code, currency),
    );
  }
}
