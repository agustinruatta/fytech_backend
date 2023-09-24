import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAccount1695592517229 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE accounts
       (
           id         uuid                        DEFAULT public.uuid_generate_v4() NOT NULL UNIQUE,
           name       character varying                                             NOT NULL,
           user_id    uuid                                                          NOT NULL,
           created_at timestamp without time zone DEFAULT now()                     NOT NULL,
           updated_at timestamp without time zone DEFAULT now()                     NOT NULL,
           CONSTRAINT fk_account_user_id_id FOREIGN KEY (user_id) REFERENCES users (id)
       )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE accounts');
  }
}
