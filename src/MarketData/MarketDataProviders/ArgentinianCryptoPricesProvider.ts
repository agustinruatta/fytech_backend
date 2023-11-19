import { MarketDataProvider } from './MarketDataProvider';
import { GetCurrentMarketDataResponse } from '../DTO/GetCurrentMarketDataResponse';
import GetCurrentMarketDataRequest from '../DTO/GetCurrentMarketDataRequest';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import Money from '../../Money/Money';
import { InstrumentTypes } from '../InstrumentTypes';

@Injectable()
export default class ArgentinianCryptoPricesProvider
  implements MarketDataProvider
{
  constructor(private readonly httpService: HttpService) {}

  async getCurrentMarketData(
    request: GetCurrentMarketDataRequest,
  ): Promise<GetCurrentMarketDataResponse> {
    const allPricesData: {
      ask: number;
      totalAsk: number;
      bid: number;
      totalBid: number;
      time: number;
    }[] = (
      await this.httpService.axiosRef.get(
        `https://criptoya.com/api/${request.code.toLocaleLowerCase()}/${request.currency.toLocaleLowerCase()}`,
      )
    ).data;

    const data = Object.values(allPricesData)[0];

    return GetCurrentMarketDataResponse.newWithMoney(
      Money.newFromString(data.totalAsk.toString(), request.currency),
      Money.newFromString(data.totalBid.toString(), request.currency),
      InstrumentTypes.CRYPTO,
      new Date(data.time * 1000),
    );
  }

  doesSupportCode(request: GetCurrentMarketDataRequest): boolean {
    const supportedCryptosCodes = ['BTC', 'USDC', 'USDT', 'DAI'];

    return (
      supportedCryptosCodes.includes(request.code) && request.currency === 'ARS'
    );
  }
}
