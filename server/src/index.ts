import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSchema } from "type-graphql";
import { AppDataSource } from "./data-source";
import { UserResolver } from "./resolvers/user.resolver";

const PORT = process.env.PORT || 8080;

(async () => {
  const app = express();

  await AppDataSource.initialize();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
    }),
  });
  await apolloServer.start();

  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(apolloServer, {
      context: async ({ req }) => ({ token: req.headers.token }),
    })
  );

  app.get("/", (_req, res) => res.send("<h1>JWT GraphQL Auth Server!</h1>"));

  app.listen(PORT, () => {
    console.log("Server started on port", PORT);
  });
})();
