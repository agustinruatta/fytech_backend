import { MarketDataProvider } from './MarketDataProvider';
import { GetCurrentMarketDataResponse } from '../response/GetCurrentMarketDataResponse';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

export class EstadisticasBCRAProvider implements MarketDataProvider {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async getCurrentMarketData(
    code: string,
  ): Promise<GetCurrentMarketDataResponse> {
    const response = this.httpService.get(
      'https://api.estadisticasbcra.com/uva',
      {
        headers: {
          Authorization:
            'Bearer ' + this.configService.get('ESTADISTICAS_BCRA_API_KEY'),
        },
      },
    );

    console.log(response);

    const lastData = { v: 1, d: 'asd' };

    return new GetCurrentMarketDataResponse(lastData.v, new Date(lastData.d));
  }

  doesSupportCode(code: string): boolean {
    return code === 'uva_ar';
  }
}
