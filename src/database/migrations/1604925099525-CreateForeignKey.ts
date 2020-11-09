import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class CreateForeignKey1604925099525
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'transactions',
      new TableForeignKey({
        name: 'CateroryForeignKey', // colocando nome dessa tableforeignkey pra ficar mais facil de deletar dps
        columnNames: ['category_id'], // quais colunas que vao receber o valor de uma tabela estrangeira
        referencedColumnNames: ['id'], // de onde que vem o dado? no caso aqui vem da tabela users > id
        referencedTableName: 'categories', // de qual tabela ta vindo essa info?
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('transactions', 'category_id');

    await queryRunner.addColumn(
      'transactions',
      new TableColumn({
        name: 'category_id',
        type: 'uuid',
      }),
    );
  }
}
