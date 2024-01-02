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
import { AppDataSource } from "../data-source";

export const createAccessToken = (user: User) => {
  return sign({ userId: user.id }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRATION_TIME,
  });
};

export const createRefreshToken = (user: User) => {
  return sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRATION_TIME,
    }
  );
};

export const verifyRefreshToken = (refreshToken: string) => {
  const payload = verify(refreshToken, REFRESH_TOKEN_SECRET) as JwtPayload;

  if (!payload || (payload && !payload.userId)) return false;

  return payload;
};

export const setRefreshTokenCookie = (res: Response, token: string) => {
  return res.cookie(REFRESH_TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    path: "/refresh_token",
  });
};

export const clearRefreshTokenCookie = (res: Response) => {
  return res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
    httpOnly: true,
    path: "/refresh_token",
  });
};

export const revokeRefreshToken = (userId: number) => {
  return AppDataSource.getRepository(User).increment(
    { id: userId },
    "tokenVersion",
    1
  );
};
