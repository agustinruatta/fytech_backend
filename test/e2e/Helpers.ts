import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../../src/Users/Entities/User';
import { getRepositoryToken } from '@nestjs/typeorm';

export default class Helpers {
  static async registerUser(app: INestApplication) {
    await request(app.getHttpServer()).post('/users').send({
      email: 'user@gmail.com',
      password: 'password',
      defaultAccountName: 'John Williams',
    });
  }

  static async signIn(
    app: INestApplication,
  ): Promise<{ accessToken: string; user: User }> {
    await this.registerUser(app);

    return {
      accessToken: (
        await request(app.getHttpServer())
          .post('/auth/login')
          .send({ email: 'user@gmail.com', password: 'password' })
      ).body.access_token,
      user: await app
        .get<Repository<User>>(getRepositoryToken(User))
        .findOneBy({ email: 'user@gmail.com' }),
    };
  }
}
