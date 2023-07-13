import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { MarketDataService } from './MarketDataService';
import { GetCurrentMarketDataResponse } from './dto/GetCurrentMarketDataResponse';
import GetCurrentMarketDataRequest from './dto/GetCurrentMarketDataRequest';

@Controller('market-data')
export class MarketDataController {
  constructor(private readonly marketDataService: MarketDataService) {}

  @UseInterceptors(ClassSerializerInterceptor)
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
