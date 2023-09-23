import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import createAppToTest from './config/e2e-app-creator';
import { Repository } from 'typeorm';
import { User } from '../../src/Users/Entities/User';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    app = await createAppToTest();
    userRepository = app.get<Repository<User>>(getRepositoryToken(User));
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

  it('creates new user', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send({ email: 'user@gmail.com', password: 'password' })
      .expect(201)
      .expect({ email: 'user@gmail.com' });

    const users = await userRepository.find();

    expect(users[users.length - 1].getEmail()).toBe('user@gmail.com');
  });

  it('fails if user has registered previously', async () => {
    //Creates user for first time
    await request(app.getHttpServer())
      .post('/users')
      .send({ email: 'user@gmail.com', password: 'password' });

    await request(app.getHttpServer())
      .post('/users')
      .send({ email: 'user@gmail.com', password: 'anotherPassword' })
      .expect(400)
      .expect({
        message: ['This email is already associated with another account'],
        error: 'Bad Request',
        statusCode: 400,
      });
  });
});
