import { Injectable } from '@nestjs/common';
import { GetCurrentMarketDataResponse } from './response/GetCurrentMarketDataResponse';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MarketDataService {
  private configService: ConfigService;

  constructor(configService: ConfigService) {
    this.configService = configService;
  }

  async getCurrentMarketData(
    code: string,
  ): Promise<GetCurrentMarketDataResponse> {
    if (code !== 'uva_ar') {
      throw new Error('Invalid code');
    }

    const response: { d: string; v: number }[] = (
      await axios.get('https://api.estadisticasbcra.com/uva', {
        headers: {
          Authorization:
            'Bearer ' + this.configService.get('ESTADISTICAS_BCRA_API_KEY'),
        },
      })
    ).data;

    const lastData = response[response.length - 1];

    return new GetCurrentMarketDataResponse(lastData.v, new Date(lastData.d));
  }
}
