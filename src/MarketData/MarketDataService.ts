import { Injectable } from '@nestjs/common';
import { GetCurrentMarketDataResponse } from './dto/GetCurrentMarketDataResponse';
import { MarketDataProvider } from './market_data_providers/MarketDataProvider';
import GetCurrentMarketDataRequest from './dto/GetCurrentMarketDataRequest';

@Injectable()
export class MarketDataService {
  constructor(private readonly marketDataProviders: MarketDataProvider[]) {
    this.marketDataProviders = marketDataProviders;
  }

  async getCurrentMarketData(
    request: GetCurrentMarketDataRequest,
  ): Promise<GetCurrentMarketDataResponse> {
    for (const provider of this.marketDataProviders) {
      if (provider.doesSupportCode(request)) {
        return provider.getCurrentMarketData(request);
      }
    }

    throw new Error('Invalid code');
  }
}
