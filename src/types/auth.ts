import Users from "../entity/users";

export type UserData = Omit<Users, "password">;

declare global {
  namespace Express {
    interface Request {
      user?: UserData;
    }
  }
}
