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
    const supportedCryptosCodes = ['BTC', 'USDC', 'USDT', 'DAI'];

    return (
      supportedCryptosCodes.includes(request.code) && request.currency === 'ARS'
    );
  }
}
