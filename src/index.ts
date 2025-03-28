import "reflect-metadata";
import "dotenv/config";
import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { AppDataSource } from "./database";
import usersRouter from "./routes/users";
import authRouter, { authenticateToken } from "./routes/auth";

const PORT = process.env.PORT || 3000;
const app = express();

AppDataSource.initialize()
  .then(() => console.log("Data source has been initialized!"))
  .catch((error) => {
    throw new Error("Connection to the data source failed.\n" + error);
  });

app.use(morgan(process.env.NODE_ENV == "development" ? "dev" : "short"));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(authRouter);

app.use(authenticateToken);
app.use(usersRouter);


app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
