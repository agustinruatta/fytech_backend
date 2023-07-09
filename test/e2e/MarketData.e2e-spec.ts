import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MarketDataModule } from '../../src/MarketData/MarketDataModule';

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
    return request(app.getHttpServer())
      .get('/market-data/current/uva_ar')
      .expect(200)
      .expect({ value: 278.28, date: '2023-07-09T00:00:00.000Z' });
  });
});
