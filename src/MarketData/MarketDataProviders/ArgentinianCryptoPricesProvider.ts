import { MarketDataProvider } from './MarketDataProvider';
import { GetCurrentMarketDataResponse } from '../DTO/GetCurrentMarketDataResponse';
import GetCurrentMarketDataRequest from '../DTO/GetCurrentMarketDataRequest';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import Money from '../../Money/Money';

@Injectable()
export default class ArgentinianCryptoPricesProvider
  implements MarketDataProvider
{
  constructor(private readonly httpService: HttpService) {}

  async getCurrentMarketData(
    request: GetCurrentMarketDataRequest,
  ): Promise<GetCurrentMarketDataResponse> {
    const data: {
      ask: number;
      totalAsk: number;
      bid: number;
      totalBid: number;
      time: number;
    } = (
      await this.httpService.axiosRef.get(
        `https://criptoya.com/api/satoshitango/${request.code.toLocaleLowerCase()}/ars`,
      )
    ).data;

    return GetCurrentMarketDataResponse.newWithMoney(
      Money.newFromString(data.totalAsk.toString(), request.currency),
      Money.newFromString(data.totalBid.toString(), request.currency),
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
