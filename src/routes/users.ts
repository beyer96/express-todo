import { Router } from "express";
import bcrypt from "bcrypt";
import { AppDataSource } from "../database";
import Users from "../entity/users";
import { clearUsersTokens } from "./auth";
import { validate } from "class-validator";

const router = Router();
const users = AppDataSource.getRepository(Users);

router.get("/users", async (req, res) => {
  const usersArray = await users.find();
  res.json({ status: "OK", data: usersArray });
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
    if (!user) {
      res.sendStatus(404);
      
      return;
    }
    const { firstName, lastName, username, email, password } = req.body;

    firstName && (user.first_name = firstName);
    lastName && (user.last_name = lastName);
    username && (user.username = username);
    email && (user.email = email);
    password && (user.password = password);

    let validationErrors = await validate(user);
    
    // Do not force the existing user to satisfy new set of internal password validation rules
    // (unless he intentionally changes his password!)
    if (!password) {
      validationErrors = validationErrors.filter(error => error.property !== "password");
    }
    if (validationErrors.length) {
      res.status(422).json(validationErrors);
      return;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      hashedPassword && (user.password = hashedPassword);
    }

    await user.save();
    const { password: userPassword, ...userData } = user;

    res.status(200).json(userData);
  })
  .delete(async (req, res) => {
    const user = await Users.findOne({ where: { id: +req.params.userId } });
    if (!user) {
      res.sendStatus(404);

      return;
    }

    if (!req.user || +req.params.userId !== req.user.id) {
      res.sendStatus(401);

      return;
    }

    await user.remove();
    clearUsersTokens(req, res);

    res.sendStatus(204);
  });

export default router;
