import dataSource from './MigrationsDataSource';
import { DataSource } from 'typeorm';

const databaseUrl =
  'postgres://fytech_test:test@postgres_test:5432/fytech_test';

export default new DataSource({
  type: 'postgres',
  url: databaseUrl,
  migrationsRun: true,
  migrationsTableName: 'migrations',
  migrations: dataSource.options.migrations,
  synchronize: false,
});
