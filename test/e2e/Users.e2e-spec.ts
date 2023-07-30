import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { CustomSerializationInterceptor } from '../../src/Shared/Serialization/CustomSerializationInterceptor';
import { AppModule } from '../../src/app.module';

describe('Users (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(new CustomSerializationInterceptor());

    await app.init();
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
      .expect({});

    //TODO: check user is created
  });
});
