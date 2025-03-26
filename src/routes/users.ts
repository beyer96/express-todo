import Express, { Router } from "express";
import { AppDataSource } from "../database";
import Users from "../entity/users";

const router = Router();
const users = AppDataSource.getRepository(Users);

router.get("/users", async (req, res) => {
  const usersArray = await users.find();
  res.json({ status: "OK", data: usersArray });
});

router.route("/user")
  .post(async (req, res) => {
    const { firstName, lastName, username, email, password } = req.body;
    const user = Users.create({
      first_name: firstName,
      last_name: lastName,
      username,
      password,
      email,
    });

    await user.save();

    res.json(user);
  })

export default router;
