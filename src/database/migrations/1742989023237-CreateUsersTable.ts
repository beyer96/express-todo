import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUsersTable1742989023237 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    const usersTable = new Table({
      name: "users",
      columns: [
        {
          name: "id",
          type: "int",
          isPrimary: true,
          isGenerated: true,
          generationStrategy: "increment"
        },
        {
          name: "first_name",
          type: "varchar",
        },
        {
          name: "last_name",
          type: "varchar",
        },
        {
          name: "username",
          type: "varchar",
          isUnique: true
        },
        {
          name: "email",
          type: "varchar",
          isUnique: true
        },
        {
          name: "password",
          type: "text"
        }
      ]
    });

    await queryRunner.createTable(usersTable);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("users", true);
  }

}
