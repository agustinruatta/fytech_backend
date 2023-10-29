import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import createAppToTest from './config/e2e-app-creator';
import Helpers from './Helpers';

describe('Balance (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createAppToTest();
  });

  describe('getAllAssetsBalance', () => {
    it('fails if there is not account with provided id', async () => {
      const signInDataA = await Helpers.signIn(app);

      return request(app.getHttpServer())
        .get('/balance/3ecded66-941f-493f-838e-59c7d7771b80')
        .auth(signInDataA.accessToken, { type: 'bearer' })
        .send()
        .expect(400)
        .expect({
          message: ["You don't have permissions to use provided account id"],
          error: 'Bad Request',
          statusCode: 400,
        });
    });

    it('fails if you do not have access to this account', async () => {
      const signInDataA = await Helpers.signIn(app);
      const signInDataB = await Helpers.signIn(app, {
        email: 'test@mail.com',
        password: 'password',
        defaultAccountName: 'Some name',
      });

      return request(app.getHttpServer())
        .get('/balance/' + (await signInDataA.user.accounts)[0].getId())
        .auth(signInDataB.accessToken, { type: 'bearer' })
        .send()
        .expect(400)
        .expect({
          message: ["You don't have permissions to use provided account id"],
          error: 'Bad Request',
          statusCode: 400,
        });
    });

    it('returns your balance', async () => {
      const signInDataA = await Helpers.signIn(app);
      const accountIdA = (await signInDataA.user.accounts)[0].getId();

      const signInDataB = await Helpers.signIn(app);
      const accountIdB = (await signInDataB.user.accounts)[0].getId();

      //Buy 200 AMZN
      await Helpers.buyTransaction(
        app,
        signInDataA.accessToken,
        accountIdA,
        'AMZN',
        200,
        '150',
        'USD',
      );

      //Sell 100 AMZN
      await Helpers.sellTransaction(
        app,
        signInDataA.accessToken,
        accountIdA,
        'AMZN',
        100,
        '100',
        'USD',
      );

      //Buy 0.5 BTC
      await Helpers.sellTransaction(
        app,
        signInDataA.accessToken,
        accountIdA,
        'BTC',
        0.5,
        '25',
        'USD',
      );

      //Another account Buy 1000 AMZN. This is to check that it only calculates on specified account
      await Helpers.buyTransaction(
        app,
        signInDataB.accessToken,
        accountIdB,
        'AMZN',
        1000,
        '700',
        'USD',
      );

      return request(app.getHttpServer())
        .get('/balance/' + accountIdA)
        .auth(signInDataA.accessToken, { type: 'bearer' })
        .send()
        .expect(200)
        .expect([
          {
            type: 'stock',
            code: 'AMZN',
            amount: 100,
            money: {
              cents: 50000,
              currency: 'USD',
              floatValue: 50,
            },
          },
          {
            type: 'crypto',
            code: 'BTC',
            amount: 0.5,
            money: {
              cents: 25000,
              currency: 'USD',
              floatValue: 25,
            },
          },
        ]);
    });
  });
});
