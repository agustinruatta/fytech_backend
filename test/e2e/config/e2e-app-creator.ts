import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { CustomSerializationInterceptor } from '../../../src/Shared/Serialization/CustomSerializationInterceptor';
import { Connection, EntityManager } from 'typeorm';
import { HTTPSerializableInterceptor } from "../../../src/Shared/Exceptions/HTTPSerializableInterceptor";

export default async function createAppToTest() {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();

  //TODO: import from production app
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new CustomSerializationInterceptor());
  app.useGlobalInterceptors(new HTTPSerializableInterceptor());

  await app.init();

  setUpTransactionToRollbackDatabaseBetweenTests(app);

  return app;
}

function setUpTransactionToRollbackDatabaseBetweenTests(
  app: INestApplication<any>,
) {
  const dbConnection = app.get(Connection);
  const manager = app.get(EntityManager);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // noinspection JSConstantReassignment
  const queryRunner = (manager.queryRunner =
    dbConnection.createQueryRunner('master'));

  global.testingQueryRunner = queryRunner;
}
