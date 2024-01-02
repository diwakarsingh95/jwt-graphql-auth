import { MiddlewareFn } from "type-graphql";
import { JwtPayload, verify } from "jsonwebtoken";
import { HttpContext } from "../types";
import { ACCESS_TOKEN_SECRET, NOT_AUTHORIZED } from "../utils/constants";

export const authMiddleware: MiddlewareFn<HttpContext> = (
  { context },
  next
) => {
  const authHeader = context.req.headers["authorization"];

  if (!authHeader) throw new Error(NOT_AUTHORIZED);

  try {
    const token = authHeader.split(" ")[1];
    const payload = verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;

    if (!payload || (payload && !payload.userId))
      throw new Error(NOT_AUTHORIZED);

    context.payload = { userId: payload.userId };
  } catch (err) {
    console.error(err);
    throw new Error(NOT_AUTHORIZED);
  }
  return next();
};
