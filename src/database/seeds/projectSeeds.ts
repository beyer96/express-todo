import { Faker } from "@faker-js/faker";
import Projects from "../../entity/projects";
import Users from "../../entity/users";
import { forEachUser } from "./utils";

export default async function seedProjects(faker: Faker) {
  const PROJECTS_PER_USER_COUNT = 5;

  try {
    process.stdout.write("Seeding projects...");
    await forEachUser(seedProjectsForUser);
    process.stdout.write(" ✅\n");
  } catch (error) {
    process.stdout.write(" ❌\n")
    console.error(error);
    process.exit();
  }

  async function seedProjectsForUser(user: Users) {
    for (let i = 0; i < PROJECTS_PER_USER_COUNT; i++) {
      const seed = Math.round(i + (Math.random() * 100));
      console.log(seed);
      faker.seed(seed);
  
      const project = createFakeProject(user, faker);
  
      await project.save();
    }
  }
}

function createFakeProject(user: Users, faker: Faker): Projects {
  return Projects.create({
    title: faker.book.title(),
    is_done: Math.random() > 0.5,
    user
  });
}
