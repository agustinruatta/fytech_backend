import { Injectable } from '@nestjs/common';
import { GetCurrentMarketDataResponse } from './response/GetCurrentMarketDataResponse';
import { MarketDataProvider } from './market_data_providers/MarketDataProvider';

@Injectable()
export class MarketDataService {
  constructor(private readonly marketDataProviders: MarketDataProvider[]) {
    this.marketDataProviders = marketDataProviders;
  }

  async getCurrentMarketData(
    code: string,
  ): Promise<GetCurrentMarketDataResponse> {
    for (const provider of this.marketDataProviders) {
      if (provider.doesSupportCode(code)) {
        return provider.getCurrentMarketData(code);
      }
    }

    throw new Error('Invalid code');
  }
}
