import { prisma, Prisma } from "./generated/prisma-client";
import { ExpressContext } from "apollo-server-express/dist/ApolloServer";

export interface Context {
  req: ExpressContext;
  prisma: Prisma;
}

export default {
  prisma,
};
