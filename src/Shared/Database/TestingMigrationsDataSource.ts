import dataSource from './MigrationsDataSource';
import { DataSource } from 'typeorm';

const databaseUrl = 'postgres://fytech_test:test@localhost:5433/fytech_test';

console.log(dataSource.options.migrations);

export default new DataSource({
  type: 'postgres',
  url: databaseUrl,
  migrationsRun: true,
  migrationsTableName: 'migrations',
  migrations: dataSource.options.migrations,
  synchronize: false,
});
