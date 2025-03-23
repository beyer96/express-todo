import { Router } from "express";
import { AppDataSource } from "../database";
import { Users } from "../entity/users";

const router = Router();
const users = AppDataSource.getRepository(Users);

router.get("/users", async (req, res) => {
  const usersArray = await users.find();
  res.json({ status: "OK", data: usersArray });
});

export default router;
