import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTransactions1587343382178 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.createTable(
            new Table({
                name: 'transactions',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()'
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                    },
                    {
                        name: 'value',
                        type: 'decimal',
                    },
                    {
                        name: 'type',
                        type: 'varchar',
                    },
                    {
                        name: 'category_id',
                        type: 'uuid',
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()'
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'now()'
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('transactions');
    }

}
