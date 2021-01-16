import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddColumnUserTokensUsed1610594276959
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user_tokens',
      new TableColumn({
        name: 'is_used',
        type: 'boolean',
        default: 'false',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropColumn('user_tokens', 'is_used');
  }
}
