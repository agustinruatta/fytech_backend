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
  });
});
