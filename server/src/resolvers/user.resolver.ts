import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { compare, hash } from "bcryptjs";
import { User } from "../entity/User";
import { HttpContext } from "../types";
import {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} from "../utils/auth";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  INVALID_LOGIN,
  REFRESH_TOKEN_COOKIE_NAME,
  REGISTRATION_SUCCESS,
  SOMETHING_WENT_WRONG,
  USER_ALREADY_EXISTS,
  USER_NOT_FOUND,
} from "../utils/constants";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@ObjectType()
class RegisterResponse {
  @Field()
  message: string;

  @Field()
  success: boolean;
}

@Resolver()
export class UserResolver {
  @Query(() => [User])
  users() {
    return User.find();
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: HttpContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error(USER_NOT_FOUND);
    }

    const isValidPassword = await compare(password, user.password);

    if (!isValidPassword) throw new Error(INVALID_LOGIN);

    sendRefreshToken(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user),
    };
  }

  @Mutation(() => RegisterResponse)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<RegisterResponse> {
    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) throw USER_ALREADY_EXISTS;

      const hashedPassword = await hash(password, 12);
      await User.insert({
        email,
        password: hashedPassword,
      });
      return { success: true, message: REGISTRATION_SUCCESS };
    } catch (err) {
      console.error(err);
      let errorMsg = SOMETHING_WENT_WRONG;
      if (typeof err === "string") errorMsg = err;
      else if (err instanceof Error) errorMsg = err.message;
      throw new Error(errorMsg);
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(authMiddleware)
  async logout(@Ctx() { res }: HttpContext) {
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
    return true;
  }
}
