import "reflect-metadata";
import "dotenv/config";
import express from "express";
import { AppDataSource } from "./database";

const PORT = process.env.PORT || 3000;
const app = express();

AppDataSource.initialize()
  .then(() => console.log("Data source has been initialized!"))
  .catch((error) => console.error("Something went wrong...\n" + error));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
