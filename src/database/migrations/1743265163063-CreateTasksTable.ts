import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTasksTable1743265163063 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    const tasksTable = new Table({
      name: "tasks",
      columns: [
        {
          name: "id",
          type: "int",
          isPrimary: true,
          isGenerated: true,
          generationStrategy: "increment"
        },
        {
          name: "title",
          type: "varchar"
        },
        {
          name: "description",
          type: "text",
          isNullable: true
        },
        {
          name: "is_done",
          type: "boolean",
          default: false
        },
        {
          name: "user_id",
          type: "int"
        }
      ]
    });

    await queryRunner.createTable(tasksTable);
    await queryRunner.createForeignKey(
      "tasks",
      new TableForeignKey({
        columnNames: ["user_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE"
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("tasks");
  }

}
