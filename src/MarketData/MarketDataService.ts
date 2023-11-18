import { Injectable } from '@nestjs/common';
import { GetCurrentMarketDataResponse } from './DTO/GetCurrentMarketDataResponse';
import { MarketDataProvider } from './MarketDataProviders/MarketDataProvider';
import GetCurrentMarketDataRequest from './DTO/GetCurrentMarketDataRequest';
import InstrumentNotFoundException from '../Shared/Exceptions/InstrumentNotFoundException';

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

    throw new InstrumentNotFoundException(request.code, request.currency);
  }
}
