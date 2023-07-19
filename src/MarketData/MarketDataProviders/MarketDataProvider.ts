import { GetCurrentMarketDataResponse } from '../DTO/GetCurrentMarketDataResponse';
import GetCurrentMarketDataRequest from '../DTO/GetCurrentMarketDataRequest';

export interface MarketDataProvider {
  getCurrentMarketData(
    request: GetCurrentMarketDataRequest,
  ): Promise<GetCurrentMarketDataResponse>;

  doesSupportCode(request: GetCurrentMarketDataRequest): boolean;
}
