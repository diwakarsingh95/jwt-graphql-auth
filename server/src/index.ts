import express from "express";
import http from "http";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { buildSchema } from "type-graphql";
import { AppDataSource } from "./data-source";
import { UserResolver } from "./resolvers/user.resolver";

const PORT = process.env.PORT || 8080;

(async () => {
  const app = express();
  const httpServer = http.createServer(app);

  await AppDataSource.initialize();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
    }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await apolloServer.start();

  app.use("/graphql", express.json(), expressMiddleware(apolloServer));

  app.get("/", (_req, res) => res.send("<h1>JWT GraphQL Auth Server!</h1>"));

  httpServer.listen(PORT, () => {
    console.log("Server started on port", PORT);
  });
})();
