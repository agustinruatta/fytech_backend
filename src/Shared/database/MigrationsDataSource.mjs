import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();
const databaseUrl = process.env.DB_URL;

if (!databaseUrl) {
  throw 'Invalid database URL';
}

export default new DataSource({
  type: 'postgres',
  url: databaseUrl,
  migrationsRun: true,
  migrationsTableName: 'migrations',
  migrations: [],
  synchronize: false,
});
