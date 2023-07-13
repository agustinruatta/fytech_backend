import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MarketDataModule } from '../../src/MarketData/MarketDataModule';
import * as nock from 'nock';

describe('MarketData (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MarketDataModule],
    }).compile();

    app = moduleFixture.createNestApplication();
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
});
