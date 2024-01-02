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
import { INVALID_LOGIN, USER_NOT_FOUND } from "../utils/constants";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@Resolver()
export class UserResolver {
  @Query(() => [User])
  @UseMiddleware(authMiddleware)
  users(@Ctx() { payload }: HttpContext) {
    console.log(payload);
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

  @Mutation(() => Boolean)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    try {
      const hashedPassword = await hash(password, 12);
      await User.insert({
        email,
        password: hashedPassword,
      });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}
