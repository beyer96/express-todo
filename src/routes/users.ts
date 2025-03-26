import { Router } from "express";
import { AppDataSource } from "../database";
import Users from "../entity/users";

const router = Router();
const users = AppDataSource.getRepository(Users);

router.get("/users", async (req, res) => {
  const usersArray = await users.find();
  res.json({ status: "OK", data: usersArray });
});

router.post("/user", async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;
  const user = Users.create({
    first_name: firstName,
    last_name: lastName,
    username,
    password,
    email,
  });

  await user.save();

  res.status(200).json(user);
});

router.route("/user/:userId")
  .get(async (req, res) => {
    const user = await Users.findOne({ where: { id: +req.params.userId } });
    if (!user) {
      res.sendStatus(404);

      return;
    }

    const { password, ...userData } = user;

    res.status(200).json(userData);
  })
  .put(async (req, res) => {
    const user = await Users.findOne({ where: { id: +req.params.userId } });
    const { firstName, lastName, username, email } = req.body;
    if (!user) {
      res.sendStatus(404);

      return;
    }

    firstName && (user.first_name = firstName);
    lastName && (user.last_name = lastName);
    username && (user.username = username);
    email && (user.email = email);

    await user.save();
    const { password, ...userData } = user;

    res.status(200).json(userData);
  })
  .delete(async (req, res) => {
    const user = await Users.findOne({ where: { id: +req.params.userId } });
    const { firstName, lastName, username, email } = req.body;
    if (!user) {
      res.sendStatus(404);

      return;
    }

    await user.remove();

    res.sendStatus(204);
  });

export default router;
