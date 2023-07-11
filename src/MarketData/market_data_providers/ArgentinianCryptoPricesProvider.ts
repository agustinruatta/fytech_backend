import { MarketDataProvider } from './MarketDataProvider';
import { GetCurrentMarketDataResponse } from '../dto/GetCurrentMarketDataResponse';
import GetCurrentMarketDataRequest from '../dto/GetCurrentMarketDataRequest';

export default class ArgentinianCryptoPricesProvider
  implements MarketDataProvider
{
  getCurrentMarketData(
    request: GetCurrentMarketDataRequest,
  ): Promise<GetCurrentMarketDataResponse> {
    return Promise.resolve(undefined);
  }

  doesSupportCode(request: GetCurrentMarketDataRequest): boolean {
    return false;
  }
}
