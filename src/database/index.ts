import { DataSource } from "typeorm";
import Users from "../entity/users";

export const AppDataSource = new DataSource({
  synchronize: true,
  type: "postgres",
  host: process.env.HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || "express_todo_dev",
  password: process.env.DB_PASSWORD || "express_todo_dev",
  database: process.env.DB_NAME || "express_todo_dev",
  entities: [Users]
});
