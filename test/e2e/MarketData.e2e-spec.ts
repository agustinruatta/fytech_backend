import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as nock from 'nock';
import createAppToTest from './config/e2e-app-creator';
import { InstrumentTypes } from '../../src/MarketData/InstrumentTypes';
import { ConfigService } from '@nestjs/config';

describe('MarketData (e2e)', () => {
  let app: INestApplication;
  let configService: ConfigService;

  beforeAll(async () => {
    app = await createAppToTest();
    configService = app.get<ConfigService>(ConfigService);
  });

  it('get UVA current market data', () => {
    nock('https://api.estadisticasbcra.com')
      .get('/uva')
      .reply(200, [{ v: 278.28, d: '2023-07-09' }]);

    return request(app.getHttpServer())
      .get('/market-data/current/UVA_AR/ARS')
      .expect(200)
      .expect({
        value: 278.28,
        instrument_type: InstrumentTypes.UVA,
        date: '2023-07-09T00:00:00.000Z',
      });
  });

  it('get Argentinian USDC current market data', () => {
    nock('https://criptoya.com/').get('/api/satoshitango/usdc/ars').reply(200, {
      ask: 534.02,
      totalAsk: 539.36,
      bid: 511.43,
      totalBid: 506.31,
      time: 1689195600,
    });

    return request(app.getHttpServer())
      .get('/market-data/current/usdc/ARS')
      .expect(200)
      .expect({
        ask: {
          cents: 53936,
          currency: 'ARS',
          floatValue: 539.36,
        },
        bid: {
          cents: 50631,
          currency: 'ARS',
          floatValue: 506.31,
        },
        mid_price: {
          cents: 52284,
          currency: 'ARS',
          floatValue: 522.84,
        },
        instrument_type: InstrumentTypes.CRYPTO,
        date: '2023-07-12T21:00:00.000Z',
      });
  });

  it('get PAMP current market data', () => {
    nock(configService.getOrThrow('PPI_BASE_URL'))
      .post('/Account/LoginApi')
      .reply(200, {
        creationDate: '2023-11-16T23:10:56-03:00',
        expirationDate: '2023-11-17T00:40:56-03:00',
        accessToken: 'some_access_token',
        expires: 5399,
        refreshToken: 'some_refresh_token',
        tokenType: 'bearer',
      });

    return request(app.getHttpServer())
      .get('/market-data/current/pamp/ARS')
      .expect(200)
      .expect({
        ask: {
          cents: 53936,
          currency: 'ARS',
          floatValue: 539.36,
        },
        bid: {
          cents: 50631,
          currency: 'ARS',
          floatValue: 506.31,
        },
        mid_price: {
          cents: 52284,
          currency: 'ARS',
          floatValue: 522.84,
        },
        instrument_type: InstrumentTypes.STOCK,
        date: '2023-07-12T21:00:00.000Z',
      });
  });
});
