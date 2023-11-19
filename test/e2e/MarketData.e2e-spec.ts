import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as nock from 'nock';
import createAppToTest from './config/e2e-app-creator';
import { InstrumentTypes } from '../../src/MarketData/InstrumentTypes';
import { ConfigService } from '@nestjs/config';
import Helpers from './Helpers';
import { PortfolioPersonalCurrencies } from '../../src/MarketData/MarketDataProviders/PortfolioPersonal/PortofolioPersonalCurrencies';
import { PortfolioPersonalInstrumentTypes } from '../../src/MarketData/MarketDataProviders/PortfolioPersonal/PortfolioPersonalInstrumentTypes';

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
        instrumentType: InstrumentTypes.UVA,
        date: '2023-07-09T00:00:00.000Z',
      });
  });

  it('get Argentinian USDC current market data in ARS', () => {
    nock('https://criptoya.com/')
      .get('/api/usdc/ars')
      .reply(200, {
        ripio: {
          ask: 993.33,
          totalAsk: 998.31,
          bid: 921.6,
          totalBid: 916.99,
          time: 1689195600,
        },
        buenbit: {
          ask: 966.4,
          totalAsk: 966.4,
          bid: 905.7,
          totalBid: 905.7,
          time: 1689195600,
        },
      });

    return request(app.getHttpServer())
      .get('/market-data/current/usdc/ARS')
      .expect(200)
      .expect({
        ask: {
          cents: 99831,
          currency: 'ARS',
          floatValue: 998.31,
        },
        bid: {
          cents: 91699,
          currency: 'ARS',
          floatValue: 916.99,
        },
        midPrice: {
          cents: 95765,
          currency: 'ARS',
          floatValue: 957.65,
        },
        instrumentType: InstrumentTypes.CRYPTO,
        date: '2023-07-12T21:00:00.000Z',
      });
  });

  it('get GGAL current market data', () => {
    const responseData = Helpers.setInstrumentTypeMarketData(
      configService,
      'GGAL',
      PortfolioPersonalCurrencies.Pesos,
      PortfolioPersonalInstrumentTypes.ACCIONES,
      'BYMA',
      1112.9,
    );

    nock(configService.get('PPI_BASE_URL'))
      .get('/MarketData/Current?ticker=GGAL&type=ACCIONES&settlement=A-48HS')
      .matchHeader('Authorization', 'Bearer some_access_token')
      .matchHeader('AuthorizedClient', 'API_CLI_REST')
      .matchHeader('ClientKey', configService.get('PPI_CLIENT_KEY'))
      .reply(200, {
        date: '2023-11-17T17:00:01.493-03:00',
        price: 1112.9,
        volume: 2184030696.3,
        openingPrice: 1010,
        max: 1118,
        min: 1010,
        previousClose: 1019.7,
        marketChange: 93.2,
        marketChangePercent: '9.13%',
      });

    return request(app.getHttpServer())
      .get('/market-data/current/GGAL/ARS')
      .expect(200)
      .expect({
        ask: {
          cents: 111290,
          currency: 'ARS',
          floatValue: 1112.9,
        },
        bid: {
          cents: 111290,
          currency: 'ARS',
          floatValue: 1112.9,
        },
        midPrice: {
          cents: 111290,
          currency: 'ARS',
          floatValue: 1112.9,
        },
        instrumentType: InstrumentTypes.STOCK,
        date: responseData.dataDate.toISOString(),
      });
  });
});
