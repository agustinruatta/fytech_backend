import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MarketDataModule } from '../../src/MarketData/MarketDataModule';
import * as nock from 'nock';
import { CustomSerializationInterceptor } from '../../src/Shared/serialization/CustomSerializationInterceptor';

describe('MarketData (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MarketDataModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalInterceptors(new CustomSerializationInterceptor());

    await app.init();
  });

  it('get UVA current market data', () => {
    nock('https://api.estadisticasbcra.com')
      .get('/uva')
      .reply(200, [{ v: 278.28, d: '2023-07-09' }]);

    return request(app.getHttpServer())
      .get('/market-data/current/UVA_AR')
      .expect(200)
      .expect({
        ask: 278.28,
        bid: 278.28,
        mid_price: 278.28,
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
        ask: 539.36,
        bid: 506.31,
        mid_price: 522.835,
        date: '2023-07-12T21:00:00.000Z',
      });
  });
});
