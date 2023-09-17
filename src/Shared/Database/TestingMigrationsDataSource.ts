import dataSource from './MigrationsDataSource';
import { DataSource } from 'typeorm';

const databaseUrl = 'postgresql://fytech_test:test@localhost:5433/fytech_test';

console.log('ENTERING TESTING DATA SOURCE');

export default new DataSource({
  type: 'postgres',
  url: databaseUrl,
  migrationsRun: true,
  migrationsTableName: 'migrations',
  migrations: dataSource.options.migrations,
  synchronize: false,
});
