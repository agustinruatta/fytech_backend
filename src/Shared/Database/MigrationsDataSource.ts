import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { CreateUser1689808924143 } from './Migrations/1689808924143-CreateUser';

config();
const databaseUrl = process.env.DB_URL;

if (!databaseUrl) {
  throw 'Invalid database URL';
}

const b = new DataSource({
  type: 'postgres',
  url: databaseUrl,
  migrationsRun: true,
  migrationsTableName: 'migrations',
  migrations: [CreateUser1689808924143],
  synchronize: false,
});

console.log('DATASOURCE NO TEST');
console.log(b);

export default b;
