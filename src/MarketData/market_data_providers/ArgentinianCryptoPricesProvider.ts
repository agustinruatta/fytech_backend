import { MarketDataProvider } from './MarketDataProvider';
import { GetCurrentMarketDataResponse } from '../dto/GetCurrentMarketDataResponse';

export default class ArgentinianCryptoPricesProvider
  implements MarketDataProvider
{
  doesSupportCode(code: string): boolean {
    return false;
  }

  getCurrentMarketData(code: string): Promise<GetCurrentMarketDataResponse> {
    return Promise.resolve(undefined);
  }
}
