import { createServer } from "http";
import Express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { ApolloServer, gql } from "apollo-server-express";
import typeDefs from "./schema";
import resolvers from "./resolvers";
import environment from "./environment";
import context, { Context } from "./context";

const app: Express.Application = Express();
app.get("healthz", (req, res) => {
  res.sendStatus(200);
});

const whitelist: Array<string> = [
  "http://localhost:3000",
  "http://localhost:4000",
];

app.use(
  cors({
    origin: (origin, cb) => {
      if (whitelist.indexOf(origin) !== -1 || origin === undefined) {
        cb(null, true);
      } else {
        cb(new Error("Not allowed by cors"));
      }
    },
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = new ApolloServer({
  resolvers,
  typeDefs,
  context: (req): Context => ({ ...context, req }),
  introspection: environment.apollo.introspection,
  playground: environment.apollo.playground,
});

server.applyMiddleware({
  app,
});

const httpServer = createServer(app);

server.installSubscriptionHandlers(httpServer);

httpServer.listen({ port: environment.port }, () =>
  console.log(
    `🚀 Server ready at http://localhost:${environment.port}${
      server.graphqlPath
    }`
  )
);
