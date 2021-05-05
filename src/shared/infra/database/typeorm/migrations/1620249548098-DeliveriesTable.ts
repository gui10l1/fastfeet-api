import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class DeliveriesTable1620249548098
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'deliveries',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'deliveryman_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'recipient_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'product',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'address',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'postal_code',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'neighborhood',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'city',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'state',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'canceled_at',
            type: 'timestamp with time zone',
            isNullable: true,
          },
          {
            name: 'signature_id',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'start_date',
            type: 'timestamp with time zone',
            isNullable: true,
          },
          {
            name: 'end_date',
            type: 'timestamp with time zone',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'deliveries',
      new TableForeignKey({
        columnNames: ['deliveryman_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        name: 'DeliveryManId',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('deliveries', 'DeliveryManId');

    await queryRunner.dropTable('deliveries');
  }
}
