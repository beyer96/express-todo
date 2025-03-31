import Projects from "../entity/projects";
import Tasks from "../entity/tasks";
import Users from "../entity/users";

export type UserData = Omit<Users, "password">;

declare global {
  namespace Express {
    interface Request {
      user?: UserData;
      project?: Projects;
      task?: Tasks;
    }
  }
}
