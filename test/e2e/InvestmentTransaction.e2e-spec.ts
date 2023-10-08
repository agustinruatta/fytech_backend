import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import createAppToTest from './config/e2e-app-creator';
import { Repository } from 'typeorm';
import { InvestmentTransaction } from '../../src/InvestmentTransaction/Entities/InvestmentTransaction';
import { getRepositoryToken } from '@nestjs/typeorm';
import Helpers from './Helpers';

describe('InvestmentTransaction (e2e)', () => {
  let app: INestApplication;
  let investmentTransactionRepository: Repository<InvestmentTransaction>;
  const actions = ['buy', 'sell'];

  beforeAll(async () => {
    app = await createAppToTest();
    investmentTransactionRepository = app.get<
      Repository<InvestmentTransaction>
    >(getRepositoryToken(InvestmentTransaction));
  });

  actions.forEach((action) => {
    it('fails if body is empty', async () => {
      const signInData = await Helpers.signIn(app);

      return request(app.getHttpServer())
        .post('/investment-transaction/' + action)
        .auth(signInData.accessToken, { type: 'bearer' })
        .send({})
        .expect(400)
        .expect({
          message: [
            'accountId should not be empty',
            'code should not be empty',
            'amount should not be empty',
            'money should not be empty',
            'datetime must be a Date instance',
            'datetime should not be empty',
          ],
          error: 'Bad Request',
          statusCode: 400,
        });
    });

    it('creates it', async () => {
      const signInData = await Helpers.signIn(app);

      return request(app.getHttpServer())
        .post('/investment-transaction/' + action)
        .auth(signInData.accessToken, { type: 'bearer' })
        .send({
          accountId: (await signInData.user.accounts)[0].getId(),
          code: 'BTC',
          amount: 150,
          money: {
            cents: 10000,
            currency: 'USD',
          },
          datetime: '2023-10-07T11:00:00.000Z',
        })
        .expect({})
        .expect(200);
    });
  });
});