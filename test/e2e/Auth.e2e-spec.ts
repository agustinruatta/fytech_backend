import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import createAppToTest from './config/e2e-app-creator';
import Helpers from './Helpers';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createAppToTest();
  });

  describe('Sign in', () => {
    it('fails because password is wrong', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'user@gmail.com', password: 'invalid' })
        .expect(401)
        .expect({
          message: ['Invalid email/password combination'],
          error: 'Unauthorized',
          statusCode: 401,
        });
    });

    it('fails because emails and password are missing', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({})
        .expect(400)
        .expect({
          message: [
            'email must be an email',
            'email should not be empty',
            'password should not be empty',
          ],
          error: 'Bad Request',
          statusCode: 400,
        });
    });

    it('signs in because password credentials are correct', async () => {
      await Helpers.registerUser(app);

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'user@gmail.com', password: 'password' })
        .expect(200);

      expect(typeof response.body.access_token).toBe('string');
    });
  });

  describe('Get current user data', () => {
    it('returns current user data', async () => {
      const signInData = await Helpers.signIn(app);

      return request(app.getHttpServer())
        .get('/auth/current-user-data')
        .auth(signInData.accessToken, { type: 'bearer' })
        .send({})
        .expect(200)
        .expect(await signInData.user.serialize());
    });

    it('does not save state between requests', async () => {
      const signInData = await Helpers.signIn(app);

      await request(app.getHttpServer())
        .get('/auth/current-user-data')
        .auth(signInData.accessToken, { type: 'bearer' })
        .send({})
        .expect(200)
        .expect(await signInData.user.serialize());

      return request(app.getHttpServer())
        .get('/auth/current-user-data')
        .send({})
        .expect(200)
        .expect({});
    });
  });
});
