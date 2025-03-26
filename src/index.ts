import "reflect-metadata";
import "dotenv/config";
import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import { AppDataSource } from "./database";
import usersRouter from "./routes/users";
import authRouter from "./routes/auth";

const PORT = process.env.PORT || 3000;
const app = express();

AppDataSource.initialize()
  .then(() => console.log("Data source has been initialized!"))
  .catch((error) => {
    throw new Error("Connection to the data source failed.\n" + error);
  });

app.use(morgan(process.env.NODE_ENV == "development" ? "dev" : "short"));
app.use(bodyParser.json());

app.use(usersRouter);
app.use(authRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
