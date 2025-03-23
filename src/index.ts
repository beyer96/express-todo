import "reflect-metadata";
import "dotenv/config";
import express from "express";
import morgan from "morgan";
import { AppDataSource } from "./database";
import appUsersRouter from "./routes/users";

const PORT = process.env.PORT || 3000;
const app = express();

AppDataSource.initialize()
  .then(() => console.log("Data source has been initialized!"))
  .catch((error) => {
    throw new Error("Connection to the data source failed.\n" + error);
  });

app.use(morgan(process.env.NODE_ENV == "development" ? "dev" : "short"));

app.use(appUsersRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
