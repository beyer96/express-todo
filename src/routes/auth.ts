import bcrypt from "bcrypt";
import { Router } from "express";
import Users from "../entity/users";

const router = Router();

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

export default router;
