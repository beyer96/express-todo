import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Router } from "express";
import { Redis } from "ioredis";
import Users from "../entity/users";

const router = Router();
const redis = new Redis(process.env.REDIS_URL!);

redis.on("connect", () => console.log("Connected to Redis"));

router.post("/auth/signup", async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = Users.create({
    first_name: firstName,
    last_name: lastName,
    username,
    password: hashedPassword,
    email,
  });

  await user.save();

  res.status(200).json(user);
});

router.post("/auth/signin", async (req, res) => {
  const { username, password } = req.body;
  const user = await Users.findOneBy({ username });
  if (!user) {
    res.sendStatus(404);

    return;
  }

  const { password: hashedPassword, ...userData } = user;
  const validLogin = await bcrypt.compare(password, hashedPassword);
  if (!validLogin) {
    res.sendStatus(401);

    return;
  }

  res.status(200).json(userData);
});

export default router;
