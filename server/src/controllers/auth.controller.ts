import { Request, Response } from "express";
import {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
  verifyRefreshToken,
} from "..//utils/auth";
import { User } from "../entity/User";
import {
  INVALID_TOKEN,
  REFRESH_TOKEN_COOKIE_NAME,
  USER_NOT_FOUND,
} from "../utils/constants";

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
    if (!token) throw Error(INVALID_TOKEN);

    const tokenPayload = verifyRefreshToken(token);
    if (!tokenPayload) throw Error(INVALID_TOKEN);

    const user = await User.findOne({ where: { id: tokenPayload.userId } });
    if (!user) throw Error(USER_NOT_FOUND);
    else if (user.tokenVersion !== token.tokenVersion)
      throw Error(INVALID_TOKEN);

    sendRefreshToken(res, createRefreshToken(user));
    res.send({ accessToken: createAccessToken(user) });
  } catch (err) {
    console.error(err);
    const message =
      err instanceof Error ? err.message : "Something went wrong.";
    res.status(400).send({ message });
  }
};
