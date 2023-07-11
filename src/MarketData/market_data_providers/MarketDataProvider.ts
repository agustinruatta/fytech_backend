import { GetCurrentMarketDataResponse } from '../dto/GetCurrentMarketDataResponse';
import GetCurrentMarketDataRequest from '../dto/GetCurrentMarketDataRequest';

export interface MarketDataProvider {
  getCurrentMarketData(
    request: GetCurrentMarketDataRequest,
  ): Promise<GetCurrentMarketDataResponse>;

  doesSupportCode(request: GetCurrentMarketDataRequest): boolean;
}
