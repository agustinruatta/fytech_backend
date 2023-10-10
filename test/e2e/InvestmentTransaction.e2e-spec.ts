import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import createAppToTest from './config/e2e-app-creator';
import { Repository } from 'typeorm';
import { InvestmentTransaction } from '../../src/InvestmentTransaction/Entities/InvestmentTransaction';
import { getRepositoryToken } from '@nestjs/typeorm';
import Helpers from './Helpers';
import BuyInvestmentTransaction from '../../src/InvestmentTransaction/Entities/BuyInvestmentTransaction';
import Money from '../../src/Money/Money';

describe('InvestmentTransaction (e2e)', () => {
  let app: INestApplication;
  let investmentTransactionRepository: Repository<InvestmentTransaction>;
  const actions = ['buy', 'sell'];

  const validBody = {
    code: 'BTC',
    amount: 150,
    money: {
      cents: 10000,
      currency: 'USD',
    },
    datetime: '2023-10-07T11:00:00.000Z',
  };

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

    it('fails if account id is not found', async () => {
      const signInData = await Helpers.signIn(app);

      return request(app.getHttpServer())
        .post('/investment-transaction/' + action)
        .auth(signInData.accessToken, { type: 'bearer' })
        .send(
          Object.assign(validBody, {
            accountId: '1234567',
          }),
        )
        .expect(400)
        .expect({
          message: ["You don't have permissions to use sent account id"],
          error: 'Bad Request',
          statusCode: 400,
        });
    });

    it('fails if you do not have access to this account', async () => {
      const signInDataA = await Helpers.signIn(app);
      const signInDataB = await Helpers.signIn(app);

      return request(app.getHttpServer())
        .post('/investment-transaction/' + action)
        .auth(signInDataB.accessToken, { type: 'bearer' })
        .send(
          Object.assign(validBody, {
            accountId: (await signInDataA.user.accounts)[0].getId(),
          }),
        )
        .expect(400)
        .expect({
          message: ["You don't have permissions to use sent account id"],
          error: 'Bad Request',
          statusCode: 400,
        });
    });

    it('creates it', async () => {
      const signInData = await Helpers.signIn(app);
      const account = (await signInData.user.accounts)[0];

      request(app.getHttpServer())
        .post('/investment-transaction/' + action)
        .auth(signInData.accessToken, { type: 'bearer' })
        .send(
          Object.assign(validBody, {
            accountId: account.getId(),
          }),
        )
        .expect(201);

      const createdTransaction = await investmentTransactionRepository.findOne({
        order: { createdAt: 'DESC' },
        where: {},
      });

      expect(createdTransaction).toStrictEqual(
        new BuyInvestmentTransaction(
          account,
          validBody.code,
          validBody.amount,
          Money.newFromString('100', 'USD'),
          new Date(validBody.datetime),
        ),
      );
    });
  });
});
