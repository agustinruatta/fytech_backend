import { Injectable } from '@nestjs/common';
import { MarketDataProvider } from './MarketDataProvider';
import GetCurrentMarketDataRequest from '../DTO/GetCurrentMarketDataRequest';
import { GetCurrentMarketDataResponse } from '../DTO/GetCurrentMarketDataResponse';
import Money from '../../Money/Money';
import { AvailableCurrencies } from '../../Money/AvailableCurrencies';
import { InstrumentTypes } from '../InstrumentTypes';
import { HttpService } from '@nestjs/axios';
import * as moment from 'moment';
import { ConfigService } from '@nestjs/config';
import InstrumentNotFoundException from '../../Shared/Exceptions/InstrumentNotFoundException';

@Injectable()
export default class PortfolioPersonalProvider implements MarketDataProvider {
  private static loginData: { expirationDate: Date; accessToken: string } =
    null;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  doesSupportCode(request: GetCurrentMarketDataRequest): boolean {
    //This is the provider who cover all left cases, so this is why is true
    return true;
  }

  async getCurrentMarketData(
    request: GetCurrentMarketDataRequest,
  ): Promise<GetCurrentMarketDataResponse> {
    await this.getTokenIfNeeded();

    const instrumentInfo = await this.getMostProbableInstrument(request);

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

  private async getTokenIfNeeded() {
    if (
      PortfolioPersonalProvider.loginData &&
      PortfolioPersonalProvider.loginData.expirationDate >
        //Add two minutes to current, so we can consider if token is just finishing
        moment().add(2, 'm').toDate()
    ) {
      return;
    }

    const responseBody: { accessToken: string; expirationDate: string } = (
      await this.httpService.axiosRef.post(
        this.configService.getOrThrow('PPI_BASE_URL') + '/Account/LoginApi',
        {},
        {
          headers: {
            ...this.getBasicHeaders(),
            ...{
              ApiKey: this.configService.getOrThrow('PPI_API_KEY'),
              ApiSecret: this.configService.getOrThrow('PPI_API_SECRET'),
            },
          },
        },
      )
    ).data;

    PortfolioPersonalProvider.loginData = {
      accessToken: responseBody.accessToken,
      expirationDate: moment(responseBody.expirationDate).toDate(),
    };
  }

  private getBasicHeaders() {
    return {
      AuthorizedClient: 'API_CLI_REST',
      ClientKey: this.configService.getOrThrow('PPI_CLIENT_KEY'),
      'Content-Type': 'application/json',
    };
  }

  private async getMostProbableInstrument(
    request: GetCurrentMarketDataRequest,
  ) {
    //TODO: handle error. For example when code is less than 3 char
    const responseBody: {
      ticker: string;
      description: string;
      currency: 'Pesos' | 'Dolares divisa | CCL' | 'Dolares billete | MEP';
      type:
        | 'BONOS'
        | 'ACCIONES'
        | 'ACCIONES-USA'
        | 'CEDEARS'
        | 'OBLIGACIONES-NEGOCIABLES'
        | 'OPCIONES';
      market: 'BYMA' | 'NYSE' | 'NASDAQ';
    }[] = (
      await this.httpService.axiosRef.get(
        this.configService.getOrThrow('PPI_BASE_URL') +
          //TODO: Possible inject. Filter only letters
          '/MarketData/SearchInstrument?ticker=' +
          request.code,
        { headers: this.getRequestHeaders() },
      )
    ).data;

    //Get first who currency
    for (const instrumentData of responseBody) {
      if (
        request.currency ===
        this.mapPPICurrencyToOurCurrency(instrumentData.currency)
      ) {
        return instrumentData;
      }
    }

    throw new InstrumentNotFoundException(request.code, request.currency);
  }

  private getRequestHeaders() {
    return {
      ...this.getBasicHeaders(),
      ...{
        Authorization:
          'Bearer ' + PortfolioPersonalProvider.loginData.accessToken,
      },
    };
  }

  private mapPPICurrencyToOurCurrency(ppiCurrency: string) {
    const mapping = {
      Pesos: AvailableCurrencies.ARS,
      'Dolares divisa': AvailableCurrencies.USD_CCL,
      CCL: AvailableCurrencies.USD_CCL,
      'Dolares billete': AvailableCurrencies.USD_MEP,
      MEP: AvailableCurrencies.USD_MEP,
    };

    if (mapping[ppiCurrency] === undefined) {
      throw Error('PPI currency not found: ' + ppiCurrency);
    }

    return mapping[ppiCurrency];
  }
}
