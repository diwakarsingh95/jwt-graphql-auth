// Auth
export const REFRESH_TOKEN_COOKIE_NAME = "jid";
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
export const ACCESS_TOKEN_EXPIRATION_TIME =
  process.env.ACCESS_TOKEN_EXPIRATION_TIME || "1h";
export const REFRESH_TOKEN_EXPIRATION_TIME =
  process.env.REFRESH_TOKEN_EXPIRATION_TIME || "30d";

// Messages
export const USER_NOT_FOUND = "User not found.";
export const INVALID_LOGIN = "Invalid credentials.";
export const NOT_AUTHORIZED = "Not authorized.";
