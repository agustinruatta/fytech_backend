import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInvestmentTransaction1695952348361
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE investment_transactions
       (
           id             uuid                        DEFAULT public.uuid_generate_v4() NOT NULL UNIQUE,
           account_id     uuid                                                          NOT NULL,
           code           character varying                                             NOT NULL,
           amount         float                                                         NOT NULL,
           money_cents    int                                                           NOT NULL,
           money_currency character varying                                             NOT NULL,
           type           character varying                                             NOT NULL,
           datetime       timestamp without time zone                                   NOT NULL,
           created_at     timestamp without time zone DEFAULT now()                     NOT NULL,
           updated_at     timestamp without time zone DEFAULT now()                     NOT NULL,
           CONSTRAINT fk_investment_transactions_account_id_id FOREIGN KEY (account_id) REFERENCES accounts (id)
       )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE investment_transactions');
  }
}
