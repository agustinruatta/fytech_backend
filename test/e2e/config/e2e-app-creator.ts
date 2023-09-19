import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../src/app.module';
import { INestApplication } from '@nestjs/common';
import { Connection, EntityManager } from 'typeorm';
import { globalInterceptors, globalPipes } from '../../../src/main';

export default async function createAppToTest() {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();

  globalPipes.forEach((pipe) => app.useGlobalPipes(pipe));

  globalInterceptors.forEach((interceptor) =>
    app.useGlobalInterceptors(interceptor),
  );

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
