import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import createAppToTest from './config/e2e-app-creator';

describe('Users (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createAppToTest();
  });

  it('fails if email is invalid', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ email: 'invalid', password: 'password' })
      .expect(400)
      .expect({
        message: ['email must be an email'],
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  it('creates new user', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ email: 'user@gmail.com', password: 'password' })
      .expect(201)
      .expect({ email: 'user@gmail.com' });

    //TODO: check user is created
  });
});
