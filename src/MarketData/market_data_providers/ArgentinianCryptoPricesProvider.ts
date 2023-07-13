import { MarketDataProvider } from './MarketDataProvider';
import { GetCurrentMarketDataResponse } from '../dto/GetCurrentMarketDataResponse';
import GetCurrentMarketDataRequest from '../dto/GetCurrentMarketDataRequest';
import { HttpService } from '@nestjs/axios';

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
        `https://criptoya.com/api/satoshitango/${request}/ars/`,
      )
    ).data;

    return new GetCurrentMarketDataResponse(
      data.totalAsk,
      data.totalBid,
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
