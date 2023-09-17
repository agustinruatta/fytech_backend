console.log('ENTERING TESTING DATA SOURCE');
console.log(process.env.NODE_ENV);

import dataSource from './MigrationsDataSource';
import { DataSource } from 'typeorm';

const databaseUrl = 'postgresql://fytech_test:test@localhost:5433/fytech_test';

export default new DataSource({
  type: 'postgres',
  url: databaseUrl,
  migrationsRun: true,
  migrationsTableName: 'migrations',
  migrations: dataSource.options.migrations,
  synchronize: false,
});
