import { GetCurrentMarketDataResponse } from '../response/GetCurrentMarketDataResponse';

export interface MarketDataProvider {
  getCurrentMarketData(code: string): Promise<GetCurrentMarketDataResponse>;

  doesSupportCode(code: string): boolean;
}
