import { Faker } from "@faker-js/faker";
import Tasks from "../../entity/tasks";
import Users from "../../entity/users";
import { forEachProject } from "./utils";
import Projects from "../../entity/projects";

export default async function seedTasks(faker: Faker) {
  const TASKS_PER_PROJECT_COUNT = 3;

  try {
    process.stdout.write("Seeding tasks...");
    await forEachProject(seedTasksForProject);
    process.stdout.write(" ✅\n");
  } catch (error) {
    process.stdout.write(" ❌\n")
    console.error(error);
    process.exit();
  }

  async function seedTasksForProject(project: Projects) {
    for (let i = 0; i < TASKS_PER_PROJECT_COUNT; i++) {
      faker.seed(i + project.id * (Math.random() * 100));
  
      const task = createFakeTask(project, faker);
  
      await task.save();
    }
  }
}

function createFakeTask(project: Projects, faker: Faker): Tasks {
  return Tasks.create({
    title: faker.book.title(),
    description: faker.commerce.productDescription(),
    is_done: Math.random() > 0.5,
    project,
    user: project.user
  });
}
