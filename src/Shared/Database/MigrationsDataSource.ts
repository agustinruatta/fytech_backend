import { DataSource } from 'typeorm';
import { config } from 'dotenv-flow';
import { CreateUser1689808924143 } from './Migrations/1689808924143-CreateUser';
import { CreateAccount1695592517229 } from './Migrations/1695592517229-CreateAccount';

config();
const databaseUrl = process.env.DB_URL;

if (!databaseUrl) {
  throw new Error('DATABASE URL NOT FOUND IN ENVIRONMENT');
}

export default new DataSource({
  type: 'postgres',
  url: databaseUrl,
  migrationsRun: true,
  migrationsTableName: 'migrations',
  migrations: [CreateUser1689808924143, CreateAccount1695592517229],
  synchronize: false,
});
