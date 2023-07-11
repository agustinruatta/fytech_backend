import { GetCurrentMarketDataResponse } from '../dto/GetCurrentMarketDataResponse';

export interface MarketDataProvider {
  getCurrentMarketData(code: string): Promise<GetCurrentMarketDataResponse>;

  doesSupportCode(code: string): boolean;
}
