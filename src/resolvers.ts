import auth from "./modules/auth/resolvers";
export default {
  Query: {
    testMessage: (): string => {
      return "Hello World";
    },
  },
  Mutation: {
    ...auth.Mutation,
  },
};
