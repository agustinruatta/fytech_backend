import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as nock from 'nock';
import createAppToTest from './config/e2e-app-creator';

describe('MarketData (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createAppToTest();
  });

  it('get UVA current market data', () => {
    nock('https://api.estadisticasbcra.com')
      .get('/uva')
      .reply(200, [{ v: 278.28, d: '2023-07-09' }]);

    return request(app.getHttpServer())
      .get('/market-data/current/UVA_AR')
      .expect(200)
      .expect({
        value: 278.28,
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
      .get('/market-data/current/usdc?currency=ars')
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
        date: '2023-07-12T21:00:00.000Z',
      });
  });
});
