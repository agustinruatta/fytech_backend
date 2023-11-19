import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import createAppToTest from './config/e2e-app-creator';
import Helpers from './Helpers';
import { AvailableCurrencies } from '../../src/Money/AvailableCurrencies';
import { ConfigService } from '@nestjs/config';
import { PortfolioPersonalCurrencies } from '../../src/MarketData/MarketDataProviders/PortfolioPersonal/PortofolioPersonalCurrencies';
import { PortfolioPersonalInstrumentTypes } from '../../src/MarketData/MarketDataProviders/PortfolioPersonal/PortfolioPersonalInstrumentTypes';
import { InstrumentTypes } from '../../src/MarketData/InstrumentTypes';

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

    it('returns the balance of empty account', async () => {
      const signInData = await Helpers.signIn(app);
      const accountId = signInData.defaultAccount.getId();

      return request(app.getHttpServer())
        .get(`/balance/${accountId}/${AvailableCurrencies.USD}`)
        .auth(signInData.accessToken, { type: 'bearer' })
        .send()
        .expect(200)
        .expect([]);
    });

    it('returns the balance', async () => {
      const signInDataA = await Helpers.signIn(app);
      const accountIdA = signInDataA.defaultAccount.getId();

      const signInDataB = await Helpers.signIn(app, {
        email: 'test@mail.com',
        password: 'password',
        defaultAccountName: 'Some Name',
      });
      const accountIdB = signInDataB.defaultAccount.getId();

      //Buy 20 AMZN at 100 USD
      await Helpers.buyTransaction(
        app,
        signInDataA.accessToken,
        accountIdA,
        'AMZN',
        20,
        String(20 * 100),
        AvailableCurrencies.USD_CCL,
      );

      //Buy another 10 AMZN at 150 USD
      await Helpers.buyTransaction(
        app,
        signInDataA.accessToken,
        accountIdA,
        'AMZN',
        10,
        String(10 * 150),
        AvailableCurrencies.USD_CCL,
      );

      //Sell 15 AMZN at 140 USD
      await Helpers.sellTransaction(
        app,
        signInDataA.accessToken,
        accountIdA,
        'AMZN',
        15,
        String(15 * 140),
        AvailableCurrencies.USD_CCL,
      );

      //Buy 0.5 AL30D at 50.35 USD
      await Helpers.buyTransaction(
        app,
        signInDataA.accessToken,
        accountIdA,
        'AL30C',
        0.5,
        String(0.5 * 50.35),
        AvailableCurrencies.USD_CCL,
      );

      //Another account Buy 100 AMZN at 120 USD. This is to check that it only calculates on specified account
      await Helpers.buyTransaction(
        app,
        signInDataB.accessToken,
        accountIdB,
        'AMZN',
        100,
        String(100 * 120),
        AvailableCurrencies.USD_CCL,
      );

      //Set market data
      Helpers.setStockMarketData(
        app.get<ConfigService>(ConfigService),
        'AMZN',
        PortfolioPersonalCurrencies.CCL,
        PortfolioPersonalInstrumentTypes.ACCIONES,
        'BYMA',
        138.6,
      );

      Helpers.setStockMarketData(
        app.get<ConfigService>(ConfigService),
        'AL30C',
        PortfolioPersonalCurrencies.CCL,
        PortfolioPersonalInstrumentTypes.BONOS,
        'BYMA',
        28.54,
      );

      return request(app.getHttpServer())
        .get(`/balance/${accountIdA}/${AvailableCurrencies.USD_CCL}`)
        .auth(signInDataA.accessToken, { type: 'bearer' })
        .send()
        .expect(200)
        .expect((response) => {
          const expectedResponse = [
            //1 AMZN is USD 138.60
            {
              instrumentType: InstrumentTypes.STOCK,
              code: 'AMZN',
              amount: 15,
              balance: {
                cents: 138.6 * 15 * 100,
                currency: AvailableCurrencies.USD_CCL,
                floatValue: 138.6 * 15,
              },
            },
            //1 AL30D is USD 28.54
            {
              instrumentType: InstrumentTypes.BONDS,
              code: 'AL30C',
              amount: 0.5,
              balance: {
                cents: 28.54 * 0.5 * 100,
                currency: AvailableCurrencies.USD_CCL,
                floatValue: 28.54 * 0.5,
              },
            },
          ];

          expect(response.body.sort()).toStrictEqual(expectedResponse.sort());
        });
    });

    it('returns a balance with lot of decimals', async () => {
      const signInData = await Helpers.signIn(app);

      await Helpers.buyTransaction(
        app,
        signInData.accessToken,
        signInData.defaultAccount.getId(),
        'BTC',
        0.513,
        String(0.513 * 35618217.78),
        AvailableCurrencies.ARS,
      );

      await Helpers.sellTransaction(
        app,
        signInData.accessToken,
        signInData.defaultAccount.getId(),
        'BTC',
        0.2157,
        String(0.2157 * 36618217.78),
        AvailableCurrencies.ARS,
      );

      Helpers.setCryptoMarketData('BTC', 'ARS', 35618217.78);

      return request(app.getHttpServer())
        .get(
          `/balance/${signInData.defaultAccount.getId()}/${
            AvailableCurrencies.ARS
          }`,
        )
        .auth(signInData.accessToken, { type: 'bearer' })
        .send()
        .expect(200)
        .expect([
          {
            instrumentType: 'crypto',
            code: 'BTC',
            amount: 0.513 - 0.2157,
            balance: {
              cents: 1058929615,
              currency: AvailableCurrencies.ARS,
              floatValue: 10589296.15,
            },
          },
        ]);
    });
  });
});
