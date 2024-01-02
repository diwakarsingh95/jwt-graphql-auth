import {
  Arg,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { User } from "../entity/User";

const JWT_SECRET = "ps6lzFSyYP7e8a6GJCsXtANTQefw0s1O";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
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
    @Arg("password") password: string
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("User not found.");
    }

    const isValidPassword = await compare(password, user.password);

    if (!isValidPassword) throw new Error("Invalid credentials.");

    return {
      accessToken: sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" }),
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
