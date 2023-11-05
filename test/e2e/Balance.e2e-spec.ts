import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import createAppToTest from './config/e2e-app-creator';
import Helpers from './Helpers';
import { AvailableCurrencies } from '../../src/Money/AvailableCurrencies';

describe('Balance (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createAppToTest();
  });

  describe('getAllAssetsBalance', () => {
    it('fails if there is not account with provided id', async () => {
      const signInDataA = await Helpers.signIn(app);

      return request(app.getHttpServer())
        .get('/balance/3ecded66-941f-493f-838e-59c7d7771b80/ARS')
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
        .get(`/balance/${(await signInDataA.user.accounts)[0].getId()}/ARS`)
        .auth(signInDataB.accessToken, { type: 'bearer' })
        .send()
        .expect(400)
        .expect({
          message: ["You don't have permissions to use provided account id"],
          error: 'Bad Request',
          statusCode: 400,
        });
    });

    it('returns the balance', async () => {
      const signInDataA = await Helpers.signIn(app);
      const accountIdA = (await signInDataA.user.accounts)[0].getId();

      const signInDataB = await Helpers.signIn(app, {
        email: 'test@mail.com',
        password: 'password',
        defaultAccountName: 'Some Name',
      });
      const accountIdB = (await signInDataB.user.accounts)[0].getId();

      //Buy 20 AMZN at 100 USD
      await Helpers.buyTransaction(
        app,
        signInDataA.accessToken,
        accountIdA,
        'AMZN',
        20,
        String(20 * 100),
        AvailableCurrencies.USD,
      );

      //Sell 10 AMZN at 150 USD
      await Helpers.sellTransaction(
        app,
        signInDataA.accessToken,
        accountIdA,
        'AMZN',
        10,
        String(10 * 150),
        AvailableCurrencies.USD,
      );

      //Buy 0.5 BTC at 20000 USD
      await Helpers.buyTransaction(
        app,
        signInDataA.accessToken,
        accountIdA,
        'BTC',
        0.5,
        String(0.5 * 20000),
        AvailableCurrencies.USD,
      );

      //Another account Buy 100 AMZN at 120 USD. This is to check that it only calculates on specified account
      await Helpers.buyTransaction(
        app,
        signInDataB.accessToken,
        accountIdB,
        'AMZN',
        100,
        String(100 * 120),
        AvailableCurrencies.USD,
      );

      return request(app.getHttpServer())
        .get(`/balance/${accountIdA}/${AvailableCurrencies.USD}`)
        .auth(signInDataA.accessToken, { type: 'bearer' })
        .send()
        .expect(200)
        .expect([
          //1 AMZN is USD 138.60
          {
            type: 'stock',
            code: 'AMZN',
            amount: 100,
            balance: {
              cents: 138.6 * 100 * 100,
              currency: AvailableCurrencies.USD,
              floatValue: 138.6 * 100,
            },
          },
          //1 BTC is USD 34940.10
          {
            type: 'crypto',
            code: 'BTC',
            amount: 0.5,
            balance: {
              cents: 34940.1 * 0.5 * 100,
              currency: AvailableCurrencies.USD,
              floatValue: 34940.1 * 0.5,
            },
          },
        ]);
    });
  });
});
