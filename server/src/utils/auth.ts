import { Response } from "express";
import { sign, verify, JwtPayload } from "jsonwebtoken";
import { User } from "../entity/User";
import {
  ACCESS_TOKEN_EXPIRATION_TIME,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_EXPIRATION_TIME,
  REFRESH_TOKEN_SECRET,
} from "./constants";

export const createAccessToken = (user: User) => {
  return sign({ userId: user.id }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRATION_TIME,
  });
};

export const createRefreshToken = (user: User) => {
  return sign({ userId: user.id }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRATION_TIME,
  });
};

export const verifyRefreshToken = (refreshToken: string) => {
  const payload = verify(refreshToken, REFRESH_TOKEN_SECRET) as JwtPayload;

  if (!payload || (payload && !payload.userId)) return false;

  return payload.userId;
};

export const sendRefreshToken = (res: Response, token: string) => {
  return res.cookie(REFRESH_TOKEN_COOKIE_NAME, token, { httpOnly: true });
};
