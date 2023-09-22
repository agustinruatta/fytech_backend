import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import createAppToTest from './config/e2e-app-creator';

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

    it('signs in because password credentials are correct', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send({ email: 'user@gmail.com', password: 'password' });

      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'user@gmail.com', password: 'password' })
        .expect(200)
        .expect({
          email: 'user@gmail.com',
        });
    });
  });
});