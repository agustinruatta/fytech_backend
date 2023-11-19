import { Injectable } from '@nestjs/common';
import { MarketDataProvider } from './MarketDataProvider';
import GetCurrentMarketDataRequest from '../DTO/GetCurrentMarketDataRequest';
import { GetCurrentMarketDataResponse } from '../DTO/GetCurrentMarketDataResponse';
import Money from '../../Money/Money';
import { HttpService } from '@nestjs/axios';
import * as moment from 'moment';
import { ConfigService } from '@nestjs/config';
import InstrumentNotFoundException from '../../Shared/Exceptions/InstrumentNotFoundException';
import { PortfolioPersonalInstrumentTypes } from './PortfolioPersonal/PortfolioPersonalInstrumentTypes';
import { PortfolioPersonalCurrencies } from './PortfolioPersonal/PortofolioPersonalCurrencies';

@Injectable()
export default class PortfolioPersonalProvider implements MarketDataProvider {
  private static loginData: { expirationDate: Date; accessToken: string } =
    null;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  doesSupportCode(request: GetCurrentMarketDataRequest): boolean {
    //This is the provider who cover all left cases, so this is why is true
    return true;
  }

  async getCurrentMarketData(
    request: GetCurrentMarketDataRequest,
  ): Promise<GetCurrentMarketDataResponse> {
    await this.getTokenIfNeeded();

    const instrumentInfo = await this.getMostProbableInstrument(request);

    const currentMarketData = await this.getInstrumentInfo(instrumentInfo);

    return GetCurrentMarketDataResponse.newWithMoney(
      Money.newFromString(currentMarketData.price.toString(), request.currency),
      Money.newFromString(currentMarketData.price.toString(), request.currency),
      PortfolioPersonalInstrumentTypes.mapToInstrumentTypes(
        instrumentInfo.type,
      ),
      moment(currentMarketData.date).toDate(),
    );
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
      currency: PortfolioPersonalCurrencies;
      type: PortfolioPersonalInstrumentTypes;
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
        PortfolioPersonalCurrencies.mapToAvailableCurrencies(
          instrumentData.currency,
        )
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

  private async getInstrumentInfo(instrumentData: {
    ticker: string;
    type: string;
  }): Promise<{
    date: string;
    price: number;
    volume: number;
    openingPrice: number;
    max: number;
    min: number;
    previousClose: number;
    marketChange: number;
    marketChangePercent: string;
  }> {
    return (
      await this.httpService.axiosRef.get(
        //TODO: allow different settlement
        `${this.configService.getOrThrow(
          'PPI_BASE_URL',
        )}/MarketData/Current?ticker=${instrumentData.ticker}&type=${
          instrumentData.type
        }&settlement=A-48HS`,
        { headers: this.getRequestHeaders() },
      )
    ).data;
  }
}
