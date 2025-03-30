import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";

export class CreateProjectsTable1743360227768 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    const projectsTable = new Table({
      name: "projects",
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

    await queryRunner.createTable(projectsTable);
    await queryRunner.addColumn("tasks", new TableColumn({
      name: "project_id",
      type: "int",
      isNullable: true
    }));

    await queryRunner.createForeignKey(
      "projects",
      new TableForeignKey({
        columnNames: ["user_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE"
      })
    );

    await queryRunner.createForeignKey(
      "tasks",
      new TableForeignKey({
        columnNames: ["project_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "projects",
        onDelete: "CASCADE"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tasksTable = await queryRunner.getTable("tasks");
    const projectForeignKey = tasksTable?.foreignKeys.find(fk => fk.columnNames.includes("project_id"));
    if (projectForeignKey) {
      await queryRunner.dropForeignKey("tasks", projectForeignKey);
    }
    await queryRunner.dropColumn("tasks", "project_id");

    await queryRunner.dropTable("projects");
  }

}
