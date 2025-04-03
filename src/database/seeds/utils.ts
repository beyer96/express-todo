import Projects from "../../entity/projects";
import Users from "../../entity/users";

export async function forEachUser(callbackFn: (user: Users) => Promise<void>) {
  const allUsers = await Users.find();

  return Promise.all(allUsers.map(async user => await callbackFn(user)));
}

export async function forEachProject(callbackFn: (project: Projects) => Promise<void>) {
  const allProjects = await Projects.find({ relations: ["user"] });

  return Promise.all(allProjects.map(async project => await callbackFn(project)));
}
