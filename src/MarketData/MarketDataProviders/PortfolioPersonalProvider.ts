import { Injectable } from '@nestjs/common';
import { MarketDataProvider } from './MarketDataProvider';
import GetCurrentMarketDataRequest from '../DTO/GetCurrentMarketDataRequest';
import { GetCurrentMarketDataResponse } from '../DTO/GetCurrentMarketDataResponse';
import Money from '../../Money/Money';
import { AvailableCurrencies } from '../../Money/AvailableCurrencies';
import { InstrumentTypes } from '../InstrumentTypes';

@Injectable()
export default class PortfolioPersonalProvider implements MarketDataProvider {
  doesSupportCode(request: GetCurrentMarketDataRequest): boolean {
    //This is the provider who cover all left cases, so this is why is true
    return true;
  }

  getCurrentMarketData(
    request: GetCurrentMarketDataRequest,
  ): Promise<GetCurrentMarketDataResponse> {
    //TODO: Use real API
    if (request.code === 'AMZN') {
      return Promise.resolve(
        GetCurrentMarketDataResponse.newWithMoney(
          Money.newFromString('138.60', AvailableCurrencies.USD),
          Money.newFromString('138.60', AvailableCurrencies.USD),
          InstrumentTypes.STOCK,
          new Date(),
        ),
      );
    } else if (request.code === 'BTC') {
      return Promise.resolve(
        GetCurrentMarketDataResponse.newWithMoney(
          Money.newFromString('34940.10', AvailableCurrencies.USD),
          Money.newFromString('34940.10', AvailableCurrencies.USD),
          InstrumentTypes.CRYPTO,
          new Date(),
        ),
      );
    } else {
      throw new Error('Not supported yet');
    }
  }
}
