import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction, Router } from "express";
import { Redis } from "ioredis";
import Users from "../entity/users";
import { UserData } from "../types/express";
import { validate } from "class-validator";
import ValidationError from "../errors/ValidationError";
import NotFoundError from "../errors/NotFoundError";
import AuthenticationError from "../errors/AuthenticationError";
import AuthorizationError from "../errors/AuthorizationError";

const FIFTEEN_MINUTES_IN_SECONDS = 15 * 60;
const SEVEN_DAYS_IN_SECONDS = 7 * 24 * 60 * 60;
const SEVEN_DAYS_IN_MILISECONDS = SEVEN_DAYS_IN_SECONDS * 1000;
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const REFRESH_TOKEN_COOKIE_NAME = "express_todo_app_refresh_token";
const router = Router();
const redis = new Redis(process.env.REDIS_URL!);

const generateAccessToken = (user: Users) => {
  const { password, ...userData } = user;
  return jwt.sign(userData, JWT_SECRET, {
    expiresIn: FIFTEEN_MINUTES_IN_SECONDS,
  });
};

const generateRefreshToken = async (user: Users) => {
  const { password, ...userData } = user;
  const refreshToken = jwt.sign(userData, JWT_REFRESH_SECRET, {
    expiresIn: SEVEN_DAYS_IN_SECONDS,
  });

  await redis.set(`refreshToken:${refreshToken}`, user.id, "EX", SEVEN_DAYS_IN_SECONDS);

  return refreshToken;
};

router.post("/auth/signup", async (req, res, next) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;
    const user = Users.create({
      first_name: firstName,
      last_name: lastName,
      username,
      password,
      email,
    });

    const validationErrors = await validate(user);
    if (validationErrors.length) {
      throw new ValidationError({
        message: "Validation failed.",
        statusCode: 422,
        validationErrors
      });
    }

    await user.save();

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: SEVEN_DAYS_IN_MILISECONDS
    });

    const { password: userPassword, ...userData } = user;

    res.status(201).json({ accessToken, user: userData });
  } catch (error) {
    next(error);
  }
});

router.post("/auth/signin", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await Users.findOneBy({ username });
    if (!user) {
      throw new NotFoundError({ message: "User was not found.", statusCode: 404 });
    }

    const validLogin = await bcrypt.compare(password, user.password);
    if (!validLogin) {
      throw new AuthenticationError({ message: "Invalid user or password.", statusCode: 401 });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: SEVEN_DAYS_IN_MILISECONDS
    });
    res.status(200).json({ accessToken });
  } catch (error) {
    next(error);
  }
});

router.post("/auth/token", async (req, res, next) => {
  try {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
    const storedUserId = await redis.get(`refreshToken:${refreshToken}`);
    if (!refreshToken || !storedUserId) {
      throw new AuthorizationError({ message: "Unauthorized request.", statusCode: 401 });
    }

    jwt.verify(refreshToken, JWT_REFRESH_SECRET, async (err: any, payload: any) => {
      if (err) {
        throw new AuthorizationError({ message: "Unauthorized request.", statusCode: 401 });
      }

      const userInDatabase = await Users.findOneBy({ id: payload.id });
      if (!userInDatabase) throw new AuthorizationError({ message: "Failed to assign token to valid user.", statusCode: 403 });

      const newAccessToken = generateAccessToken(userInDatabase);
      const newRefreshToken = await generateRefreshToken(userInDatabase);

      await redis.del(`refreshToken:${refreshToken}`);

      res.cookie(REFRESH_TOKEN_COOKIE_NAME, newRefreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production"
      });
      return res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    next(error);
  }
});

router.post("/auth/logout", async (req, res, next) => {
  try {
    await clearUsersTokens(req, res);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];

  if (!accessToken) {
    throw new AuthenticationError({ message: "Access Denied: No Token Provided", statusCode: 401 });
  }
  
  const revokedAccessToken = await redis.get(`revokedAccessToken:${accessToken}`);
  if (revokedAccessToken) {
    throw new AuthenticationError({ message: "Invalid token.", statusCode: 403 });
  }

  jwt.verify(accessToken, JWT_SECRET as string, (err, user) => {
    if (err) {
      throw new AuthenticationError({ message: "Expired token.", statusCode: 403 });
    }

    req.user = user as UserData;
    next();
  });
};

const clearUsersTokens = async (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];
  const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, JWT_SECRET) as JwtPayload;
      const expirationTime = decoded.exp! - Math.floor(Date.now() / 1000);
    
      if (expirationTime > 0) {
        await redis.set(`revokedAccessToken:${accessToken}`, "revoked", "EX", expirationTime);
      }
    } catch {
      // Do nothing here
    }
  }

  if (refreshToken) {
    await redis.del(`refreshToken:${refreshToken}`);
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: SEVEN_DAYS_IN_MILISECONDS
    });
  }
}

export { authenticateToken, clearUsersTokens };
export default router;
