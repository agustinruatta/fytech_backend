import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CustomSerializationInterceptor } from '../../src/Shared/Serialization/CustomSerializationInterceptor';
import { UsersModule } from '../../src/Users/UsersModule';
import { AppModule } from "../../src/app.module";

describe('Users (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalInterceptors(new CustomSerializationInterceptor());

    await app.init();
  });

  it('fails if email is invalid', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ email: 'invalid', password: 'password' })
      .expect(400)
      .expect({
        value: 278.28,
        date: '2023-07-09T00:00:00.000Z',
      });
  });
});
