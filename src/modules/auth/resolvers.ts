import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { Context } from "../../context";
import { User } from "../../generated/prisma-client";

const secret = process.env.JWT_SECRET || "secretorkey123";

interface JwtPayload {
  id: string;
  email: string;
}
const signJWT = ({ id, email }: JwtPayload) => {
  return jwt.sign({ id, email }, secret, { expiresIn: 60 * 60 * 24 * 7 });
};
export default {
  Mutation: {
    signUp: async (_: any, { data }: any, ctx: Context) => {
      const userExists: boolean = await ctx.prisma.$exists.user({
        email: data.email,
      });

      if (userExists) {
        throw new Error("User already exists");
      }
      const password: string = await bcrypt.hash(data.password, 10);

      const user: User = await ctx.prisma.createUser({
        email: data.email,
        password,
        name: data.name,
      });

      const token: string = signJWT({ id: user.id, email: user.email });

      return { ...user, token };
    },
    login: async (_: any, { data }: any, ctx: Context) => {
      const fragment = `
      fragment User on User {
        id
        email
        name
        password
      }`;
      const user: User = await ctx.prisma
        .user({ email: data.email })
        .$fragment(fragment);
      if (user && user.id) {
        const match: boolean = await bcrypt.compare(
          data.password,
          user.password
        );
        if (match) {
          const token: string = signJWT({ id: user.id, email: user.email });
          return { ...user, token };
        }
      }
      throw new Error("invalid email or password");
    },
  },
};
