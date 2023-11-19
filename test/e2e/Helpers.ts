import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../../src/Users/Entities/User';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Account } from '../../src/Account/Entities/Account';
import * as nock from 'nock';
import { ConfigService } from '@nestjs/config';
import { PortfolioPersonalCurrencies } from '../../src/MarketData/MarketDataProviders/PortfolioPersonal/PortofolioPersonalCurrencies';
import { PortfolioPersonalInstrumentTypes } from '../../src/MarketData/MarketDataProviders/PortfolioPersonal/PortfolioPersonalInstrumentTypes';
import * as moment from 'moment';

export default class Helpers {
  static async registerUser(
    app: INestApplication,
    defaultData = {
      email: 'user@gmail.com',
      password: 'password',
      defaultAccountName: 'John Williams',
    },
  ) {
    await request(app.getHttpServer()).post('/users').send(defaultData);
  }

  static async signIn(
    app: INestApplication,
    defaultData = {
      email: 'user@gmail.com',
      password: 'password',
      defaultAccountName: 'John Williams',
    },
  ): Promise<{ accessToken: string; user: User; defaultAccount: Account }> {
    await this.registerUser(app, defaultData);

    const user = await app
      .get<Repository<User>>(getRepositoryToken(User))
      .findOneBy({ email: defaultData.email });

    return {
      accessToken: (
        await request(app.getHttpServer())
          .post('/auth/login')
          .send({ email: defaultData.email, password: defaultData.password })
      ).body.access_token,
      user: user,
      defaultAccount: (await user.accounts)[0],
    };
  }

  static async buyTransaction(
    app: INestApplication,
    accessToken: string,
    accountId: string,
    code: string,
    amount: number,
    moneyAmount: string,
    currency: string,
  ) {
    await request(app.getHttpServer())
      .post('/investment-transaction/buy')
      .auth(accessToken, { type: 'bearer' })
      .send({
        accountId: accountId,
        code: code,
        amount: amount,
        money: {
          amount: moneyAmount,
          currency: currency,
        },
        datetime: '2023-10-05T11:00:00.000Z',
      })
      .expect(201);
  }

  static async sellTransaction(
    app: INestApplication,
    accessToken: string,
    accountId: string,
    code: string,
    amount: number,
    moneyAmount: string,
    currency: string,
  ) {
    await request(app.getHttpServer())
      .post('/investment-transaction/sell')
      .auth(accessToken, { type: 'bearer' })
      .send({
        accountId: accountId,
        code: code,
        amount: amount,
        money: {
          amount: moneyAmount,
          currency: currency,
        },
        datetime: '2023-10-05T11:00:00.000Z',
      })
      .expect(201);
  }

  static setInstrumentTypeMarketData(
    configService: ConfigService,
    instrumentTicker: string,
    instrumentCurrency: PortfolioPersonalCurrencies,
    instrumentType: PortfolioPersonalInstrumentTypes,
    market: 'BYMA',
    price: number,
  ): { dataDate: Date } {
    const now = new Date();
    now.setMilliseconds(0);

    const nowToString = moment(now).format('YYYY-MM-DDTHH:mm:ssZ');
    const oneHourLater = moment(now)
      .add('1', 'hour')
      .format('YYYY-MM-DDTHH:mm:ssZ');

    nock(configService.get('PPI_BASE_URL'))
      .matchHeader('AuthorizedClient', 'API_CLI_REST')
      .matchHeader('ClientKey', configService.get('PPI_CLIENT_KEY'))
      .matchHeader('ApiKey', configService.get('PPI_API_KEY'))
      .matchHeader('ApiSecret', configService.get('PPI_API_SECRET'))
      .post('/Account/LoginApi')
      .reply(200, {
        creationDate: nowToString,
        expirationDate: oneHourLater,
        accessToken: 'some_access_token',
        expires: 5399,
        refreshToken: 'some_refresh_token',
        tokenType: 'bearer',
      });

    nock(configService.get('PPI_BASE_URL'))
      .get('/MarketData/SearchInstrument?ticker=' + instrumentTicker)
      .matchHeader('Authorization', 'Bearer some_access_token')
      .matchHeader('AuthorizedClient', 'API_CLI_REST')
      .matchHeader('ClientKey', configService.get('PPI_CLIENT_KEY'))
      .reply(200, [
        {
          ticker: instrumentTicker,
          description: 'Some description 1',
          currency: instrumentCurrency,
          type: instrumentType,
          market: market,
        },
        {
          ticker: instrumentTicker + 'D',
          description: 'Some description 2',
          currency: 'Dolares billete | MEP',
          type: 'ACCIONES',
          market: 'BYMA',
        },
        {
          ticker: instrumentTicker + 'C',
          description: 'Some description 3',
          currency: 'Pesos',
          type: 'ACCIONES',
          market: 'BYMA',
        },
      ]);

    nock(configService.get('PPI_BASE_URL'))
      .get(
        `/MarketData/Current?ticker=${instrumentTicker}&type=${instrumentType}&settlement=A-48HS`,
      )
      .matchHeader('Authorization', 'Bearer some_access_token')
      .matchHeader('AuthorizedClient', 'API_CLI_REST')
      .matchHeader('ClientKey', configService.get('PPI_CLIENT_KEY'))
      .reply(200, {
        date: nowToString,
        price: price,
        volume: 2184030696.3,
        openingPrice: price,
        max: (price * 1.01).toFixed(2),
        min: (price * 0.99).toFixed(2),
        previousClose: (price * 0.9).toFixed(2),
        marketChange: (price * 0.1).toFixed(2),
        marketChangePercent: '11.11%',
      });

    return { dataDate: now };
  }
}
