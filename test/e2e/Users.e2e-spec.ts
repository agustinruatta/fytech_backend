import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import createAppToTest from './config/e2e-app-creator';
import { Repository } from 'typeorm';
import { User } from '../../src/Users/Entities/User';
import { getRepositoryToken } from '@nestjs/typeorm';
import Helpers from './Helpers';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    app = await createAppToTest();
    userRepository = app.get<Repository<User>>(getRepositoryToken(User));
  });

  it('fails if body is empty', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({})
      .expect(400)
      .expect({
        message: [
          'email must be an email',
          'email should not be empty',
          'password should not be empty',
          'defaultAccountName should not be empty',
        ],
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  it('fails if email is invalid', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        email: 'invalid',
        password: 'password',
        defaultAccountName: 'John Williams',
      })
      .expect(400)
      .expect({
        message: ['email must be an email'],
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  it('creates new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({
        email: 'user@gmail.com',
        password: 'password',
        defaultAccountName: 'John Williams',
      })
      .expect(201);

    const users = await userRepository.find();
    const lastUser = users[users.length - 1];

    //Check user is saved
    expect(lastUser.getEmail()).toBe('user@gmail.com');

    const userAccount = (await lastUser.accounts)[0];

    //Check if account is saved
    expect(userAccount.getName()).toBe('John Williams');

    expect(response.body).toStrictEqual({
      user: await lastUser.serialize(),
      defaultAccount: await userAccount.serialize(),
    });
  });

  it('fails if user has registered previously', async () => {
    //Creates user for first time
    await Helpers.registerUser(app);

    await request(app.getHttpServer())
      .post('/users')
      .send({
        email: 'user@gmail.com',
        password: 'anotherPassword',
        defaultAccountName: 'John Williams',
      })
      .expect(400)
      .expect({
        message: ['This email is already associated with another account'],
        error: 'Bad Request',
        statusCode: 400,
      });
  });
});
