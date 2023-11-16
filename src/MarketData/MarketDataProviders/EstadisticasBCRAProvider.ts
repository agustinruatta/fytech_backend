import { MarketDataProvider } from './MarketDataProvider';
import { GetCurrentMarketDataResponse } from '../DTO/GetCurrentMarketDataResponse';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import GetCurrentMarketDataRequest from '../DTO/GetCurrentMarketDataRequest';
import { InstrumentTypes } from '../InstrumentTypes';

@Injectable()
export class EstadisticasBCRAProvider implements MarketDataProvider {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async getCurrentMarketData(
    request: GetCurrentMarketDataRequest,
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

    return GetCurrentMarketDataResponse.newWithValue(
      lastData.v,
      InstrumentTypes.UVA,
      new Date(lastData.d),
    );
  }

  doesSupportCode(request: GetCurrentMarketDataRequest): boolean {
    return request.code === 'UVA_AR';
  }
}
