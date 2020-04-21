import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class CreateRelationshipTransactionWithCategories1587343445280 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createForeignKey('transactions', new TableForeignKey(
            {
                name: "category",
                columnNames: ['category_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'categories',
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE'
            }
        ));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey('transactions', 'category');
    }

}
