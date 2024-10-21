import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUser1689808924143 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    await queryRunner.query(
      `CREATE TABLE users
       (
           id              uuid DEFAULT public.uuid_generate_v4() NOT NULL UNIQUE,
           email           character varying                      NOT NULL UNIQUE,
           hashed_password character varying                      NOT NULL,
           created_at      timestamp without time zone DEFAULT now() NOT NULL,
           updated_at      timestamp without time zone DEFAULT now() NOT NULL
       )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE users');
  }
}
