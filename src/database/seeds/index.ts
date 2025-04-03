import { faker } from "@faker-js/faker";
import { AppDataSource } from "..";
import seedUsers from "./userSeeds";
import seedProjects from "./projectSeeds";
import seedTasks from "./tasksSeeds";

async function seed() {
  if (process.env.NODE_ENV === "production") return;

  try {
    const dataSource = await AppDataSource.initialize();
    
    console.log("Dropping current database...");
    await dataSource.dropDatabase();
    console.log("Synchronizing database...");
    await dataSource.synchronize();

    await seedUsers(faker);
    await seedProjects(faker);
    await seedTasks(faker);

    await dataSource.destroy();
  } catch (error) {
    console.error(error);
    process.exit();
  }
}

seed();
