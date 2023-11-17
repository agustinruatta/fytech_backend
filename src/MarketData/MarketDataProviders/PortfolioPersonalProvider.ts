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
        { headers: this.getBasicHeaders() },
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
      ApiKey: this.configService.getOrThrow('PPI_API_KEY'),
      ApiSecret: this.configService.getOrThrow('PPI_API_SECRET'),
    };
  }
}
