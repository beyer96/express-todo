import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class RemovePosts1742978527480 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("posts", true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const posts = new Table({
      name: "posts",
      columns: [
        {
          name: "id",
          type: "int",
          isPrimary: true,
        },
        {
          name: "title",
          type: "varchar",
        },
        {
          name: "text",
          type: "text",
        },
        {
          name: "user_id",
          type: "int",
          isNullable: false,
        }
      ]
    });
    const fkUser = new TableForeignKey({
      columnNames: ["user_id"],
      referencedColumnNames: ["id"],
      referencedTableName: "users",
      onDelete: "CASCADE"
    })

    await queryRunner.createTable(posts);
    await queryRunner.createForeignKey(posts, fkUser)
  }
}
