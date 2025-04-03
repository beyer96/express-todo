import { Request, Response, NextFunction, Router } from "express";
import { AppDataSource } from "../database";
import Users from "../entity/users";
import { clearUsersTokens } from "./auth";
import { validate } from "class-validator";
import ValidationError from "../errors/ValidationError";
import NotFoundError from "../errors/NotFoundError";
import AuthorizationError from "../errors/AuthorizationError";

const router = Router();
const users = AppDataSource.getRepository(Users);

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await Users.findOne({ where: { id: +req.params.userId } });
    if (!user) {
      throw new NotFoundError({
        message: `User with ID ${req.params.userId} not found.`,
        statusCode: 404
      });
    }

    req.foundUser = user;
    next();
  } catch (error) {
    next(error);
  }
};

router.get("/users", async (req, res) => {
  const usersArray = await users.find();
  res.json({ status: "OK", data: usersArray });
});

router.route("/user/:userId")
  .get(getUser, async (req, res, next) => {
    try {
      const { password, ...userData } = req.foundUser!;

      res.status(200).json(userData);
    } catch (error) {
      next(error);
    }
  })
  .put(getUser, async (req, res, next) => {
    try {
      if (+req.params.userId !== req.user?.id) {
        throw new AuthorizationError({
          message: "Unauthorized for requested action.",
          statusCode: 401
        });
      }
      const user = req.foundUser!;
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
        throw new ValidationError({
          message: "Validation failed.",
          statusCode: 422,
          validationErrors
        });
      }

      await user.save();
      const { password: userPassword, ...userData } = user;

      res.status(200).json(userData);
    } catch (error) {
      next(error);
    }
  })
  .delete(getUser, async (req, res, next) => {
    try {
      const user = req.foundUser!;
      if (+req.params.userId !== req.user?.id) {
        throw new AuthorizationError({
          message: "Unauthorized for requested action.",
          statusCode: 401
        });
      }

      await user.remove();
      clearUsersTokens(req, res);

      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  });

export default router;
