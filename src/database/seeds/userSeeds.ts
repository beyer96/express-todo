import { Faker } from "@faker-js/faker";
import Users from "../../entity/users";

export default async function seedUsers(faker: Faker) {
  const SEED_COUNT = 10;

  try {
    process.stdout.write("Seeding users...");

    const mainTestingUser = Users.create({
      first_name: "John",
      last_name: "Doe",
      username: "test",
      password: "12345678",
      email: "john.doe@express-todo.com"
    });

    await mainTestingUser.save();

    for (let i = 0; i < SEED_COUNT; i++) {
      faker.seed(i);

      const user = createFakeUser(faker, i);

      await user.save();
    }
    process.stdout.write(" ✅\n");
  } catch (error) {
    process.stdout.write(" ❌\n")
    console.error(error);
    process.exit();
  }
}

function createFakeUser(faker: Faker, index: number): Users {
  const username = `testUser-${index}`;
  const firstName = faker.person.firstName(index % 2 === 0 ? "male" : "female");
  const lastName = faker.person.lastName(index % 2 === 0 ? "male" : "female");
  const password = "12345678";

  return Users.create({
    username,
    first_name: firstName,
    last_name: lastName,
    email: `${firstName}.${lastName}@express-todo.com`.toLowerCase(),
    password
  });
}
