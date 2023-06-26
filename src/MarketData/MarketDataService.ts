import { Injectable } from '@nestjs/common';
import { GetCurrentMarketDataResponse } from './response/GetCurrentMarketDataResponse';

@Injectable()
export class MarketDataService {
  getCurrentMarketData(code: string) {
    return new GetCurrentMarketDataResponse(100, new Date());
  }
}
