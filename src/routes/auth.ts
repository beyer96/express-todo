import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction, Router } from "express";
import { Redis } from "ioredis";
import Users from "../entity/users";
import { UserData } from "../types/express";
import { validate } from "class-validator";

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

router.post("/auth/signup", async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = Users.create({
      first_name: firstName,
      last_name: lastName,
      username,
      password,
      email,
    });

    const validationErrors = await validate(user);
    if (validationErrors.length) {
      res.status(422).json(validationErrors);
      return;
    }

    user.password = hashedPassword;

    await user.save();

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: SEVEN_DAYS_IN_MILISECONDS
    })

    res.status(201).json({ message: "User created successfully", accessToken });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/auth/signin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await Users.findOneBy({ username });
    if (!user) {
      res.sendStatus(404);
      
      return
    }

    const validLogin = await bcrypt.compare(password, user.password);
    if (!validLogin) {
      res.sendStatus(401);

      return;
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
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/auth/token", async (req, res) => {
  const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
  const storedUserId = await redis.get(`refreshToken:${refreshToken}`);
  if (!refreshToken || !storedUserId) {
    res.sendStatus(403);

    return;
  }

  jwt.verify(refreshToken, JWT_REFRESH_SECRET, async (err: any, payload: any) => {
    if (err) return res.sendStatus(403);

    const userInDatabase = await Users.findOneBy({ id: payload.id });
    if (!userInDatabase) return res.sendStatus(403);

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
});

router.post("/auth/logout", async (req, res) => {
  await clearUsersTokens(req, res);
  res.sendStatus(204);
});

const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];

  if (!accessToken) {
    res.status(401).json({ error: "Access Denied: No Token Provided" });
    return;
  }
  
  const revokedAccessToken = await redis.get(`revokedAccessToken:${accessToken}`);
  if (revokedAccessToken) {
    res.status(403).json({ error: "Invalid or Expired Token" });

    return;
  }

  jwt.verify(accessToken, JWT_SECRET as string, (err, user) => {
    if (err) {
      res.status(403).json({ error: "Invalid or Expired Token" });
      return;
    }

    req.user = user as UserData;
    next();
  });
};

const clearUsersTokens = async (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];
  const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
  if (!accessToken) {
    res.sendStatus(400);
    return;
  }
  
  const decoded = jwt.verify(accessToken, JWT_SECRET) as JwtPayload;
  const expirationTime = decoded.exp! - Math.floor(Date.now() / 1000);

  if (expirationTime > 0) {
    await redis.set(`revokedAccessToken:${accessToken}`, "revoked", "EX", expirationTime);
  }

  await redis.del(`refreshToken:${refreshToken}`);
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: SEVEN_DAYS_IN_MILISECONDS
  });
}

export { authenticateToken, clearUsersTokens };
export default router;
