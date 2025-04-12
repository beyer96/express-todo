import "reflect-metadata";
require("@dotenvx/dotenvx").config({ path: [".env", ".env.development"] });
import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import { AppDataSource } from "./database";
import usersRouter from "./routes/users";
import tasksRouter from "./routes/tasks";
import projectsRouter from "./routes/projects";
import authRouter, { authenticateToken } from "./routes/auth";
import errorHandler from "./middlewares/error-handler";

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
app.use(cors({ origin: process.env.FRONTEND_BASE_URL, credentials: true }));

app.use(authRouter);

app.use(authenticateToken);
app.use(usersRouter);
app.use(tasksRouter);
app.use(projectsRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
