console.log('ENTERING TESTING DATA SOURCE');

import dataSource from './MigrationsDataSource';
import { DataSource } from 'typeorm';

const databaseUrl = 'postgresql://fytech_test:test@localhost:5433/fytech_test';

const a = new DataSource({
  type: 'postgres',
  url: databaseUrl,
  migrationsRun: true,
  migrationsTableName: 'migrations',
  migrations: dataSource.options.migrations,
  synchronize: false,
});

console.log(a);

export default a;
