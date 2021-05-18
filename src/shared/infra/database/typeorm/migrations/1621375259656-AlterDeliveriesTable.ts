import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AlterDeliveriesTable1621375259656
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('deliveries', 'product');

    await queryRunner.addColumns('deliveries', [
      new TableColumn({
        name: 'product_id',
        type: 'uuid',
        isNullable: true,
      }),
      new TableColumn({
        name: 'product_quantity',
        type: 'int',
        isNullable: false,
        default: "'1'",
      }),
    ]);

    await queryRunner.createForeignKey(
      'deliveries',
      new TableForeignKey({
        columnNames: ['product_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'products',
        name: 'ProductId',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('deliveries', 'ProductId');

    await queryRunner.dropColumns('deliveries', [
      new TableColumn({
        name: 'product_id',
        type: 'uuid',
        isNullable: true,
      }),
      new TableColumn({
        name: 'product_quantity',
        type: 'int',
        isNullable: false,
      }),
    ]);

    await queryRunner.addColumn(
      'deliveries',
      new TableColumn({
        name: 'product',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
    );
  }
}
