import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAccount1695592517229 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE accounts
       (
           id              uuid DEFAULT public.uuid_generate_v4() NOT NULL,
           name            character varying                      NOT NULL,
           created_at      timestamp without time zone DEFAULT now() NOT NULL,
           updated_at      timestamp without time zone DEFAULT now() NOT NULL
       )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE accounts');
  }
}
