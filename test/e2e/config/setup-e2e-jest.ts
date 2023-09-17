console.log('E2" setup');

beforeEach(async () => {
  console.log('BEFORE EACH');
  await global.testingQueryRunner.startTransaction();
});

afterEach(async () => {
  console.log('AFTER EACH');
  await global.testingQueryRunner.rollbackTransaction();
});
