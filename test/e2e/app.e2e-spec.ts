import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import createAppToTest from './config/e2e-app-creator';
import Helpers from './Helpers';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createAppToTest();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect({ status: 'OK' });
  });

  it('does a ping', () => {
    return request(app.getHttpServer())
      .get('/ping')
      .expect(200)
      .expect({ status: 'OK' });
  });

  it('fails if is trying to access protected route without authentication', () => {
    return request(app.getHttpServer())
      .get('/logged-in-ping')
      .expect(401)
      .expect({ message: 'Unauthorized', statusCode: 401 });
  });

  it('does a logged in ping', async () => {
    //Create user
    const accessToken = await Helpers.signIn(app);

    return request(app.getHttpServer())
      .get('/logged-in-ping')
      .auth(accessToken, { type: 'bearer' })
      .expect(200)
      .expect({ status: 'OK' });
  });
});
