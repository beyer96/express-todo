import { DataSource } from "typeorm";
import { User } from "../entity/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || "express_todo_dev",
  password: process.env.DB_PASSWORD || "express_todo_dev",
  database: process.env.DB_NAME || "express_todo_dev",
  entities: [User]
});
