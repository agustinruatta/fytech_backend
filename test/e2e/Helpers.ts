import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../../src/Users/Entities/User';
import { getRepositoryToken } from '@nestjs/typeorm';

export default class Helpers {
  static async registerUser(
    app: INestApplication,
    defaultData = {
      email: 'user@gmail.com',
      password: 'password',
      defaultAccountName: 'John Williams',
    },
  ) {
    await request(app.getHttpServer()).post('/users').send(defaultData);
  }

  static async signIn(
    app: INestApplication,
    defaultData = {
      email: 'user@gmail.com',
      password: 'password',
      defaultAccountName: 'John Williams',
    },
  ): Promise<{ accessToken: string; user: User }> {
    await this.registerUser(app, defaultData);

    return {
      accessToken: (
        await request(app.getHttpServer())
          .post('/auth/login')
          .send({ email: defaultData.email, password: defaultData.password })
      ).body.access_token,
      user: await app
        .get<Repository<User>>(getRepositoryToken(User))
        .findOneBy({ email: defaultData.email }),
    };
  }

  static async buyTransaction(
    app: INestApplication,
    accessToken: string,
    accountId: string,
    code: string,
    amount: number,
    moneyAmount: string,
    currency: string,
  ) {
    await request(app.getHttpServer())
      .post('/investment-transaction/buy')
      .auth(accessToken, { type: 'bearer' })
      .send({
        accountId: accountId,
        code: code,
        amount: amount,
        money: {
          amount: moneyAmount,
          currency: currency,
        },
        datetime: '2023-10-05T11:00:00.000Z',
      });
  }

  static async sellTransaction(
    app: INestApplication,
    accessToken: string,
    accountId: string,
    code: string,
    amount: number,
    moneyAmount: string,
    currency: string,
  ) {
    await request(app.getHttpServer())
      .post('/investment-transaction/buy')
      .auth(accessToken, { type: 'bearer' })
      .send({
        accountId: accountId,
        code: code,
        amount: amount,
        money: {
          amount: moneyAmount,
          currency: currency,
        },
        datetime: '2023-10-05T11:00:00.000Z',
      });
  }
}
