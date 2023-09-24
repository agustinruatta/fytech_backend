import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

export default class Helpers {
  static async registerUser(app: INestApplication) {
    await request(app.getHttpServer()).post('/users').send({
      email: 'user@gmail.com',
      password: 'password',
      defaultAccountName: 'John Williams',
    });
  }

  static async signIn(app: INestApplication): Promise<string> {
    await this.registerUser(app);

    return (
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'user@gmail.com', password: 'password' })
    ).body.access_token;
  }
}
