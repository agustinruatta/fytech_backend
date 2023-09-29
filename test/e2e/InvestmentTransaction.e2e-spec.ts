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

  beforeAll(async () => {
    app = await createAppToTest();
    investmentTransactionRepository = app.get<
      Repository<InvestmentTransaction>
    >(getRepositoryToken(InvestmentTransaction));
  });

  it('fails if body is empty', async () => {
    const accessToken = await Helpers.signIn(app);

    return request(app.getHttpServer())
      .post('/investment-transaction')
      .auth(accessToken, { type: 'bearer' })
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
});
