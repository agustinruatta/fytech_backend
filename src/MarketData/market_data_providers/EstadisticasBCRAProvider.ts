import { MarketDataProvider } from './MarketDataProvider';
import { GetCurrentMarketDataResponse } from '../response/GetCurrentMarketDataResponse';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EstadisticasBCRAProvider implements MarketDataProvider {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async getCurrentMarketData(
    code: string,
  ): Promise<GetCurrentMarketDataResponse> {
    const data: { v: number; d: string }[] = (
      await this.httpService.axiosRef.get(
        'https://api.estadisticasbcra.com/uva',
        {
          headers: {
            Authorization:
              'Bearer ' + this.configService.get('ESTADISTICAS_BCRA_API_KEY'),
          },
        },
      )
    ).data;

    const lastData = data[data.length - 1];

    return new GetCurrentMarketDataResponse(lastData.v, new Date(lastData.d));
  }

  doesSupportCode(code: string): boolean {
    return code === 'uva_ar';
  }
}
