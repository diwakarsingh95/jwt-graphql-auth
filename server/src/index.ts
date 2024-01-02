import "dotenv/config";
import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { buildSchema } from "type-graphql";
import { AppDataSource } from "./data-source";
import { UserResolver } from "./resolvers/user.resolver";
import { refreshToken } from "./controllers/auth.controller";

const PORT = process.env.PORT || 8080;

(async () => {
  const app = express();
  app.use(cookieParser());
  app.use(
    cors({
      methods: ["POST"],
    })
  );
  const httpServer = http.createServer(app);

  await AppDataSource.initialize();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
    }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await apolloServer.start();

  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(apolloServer, {
      context: async ({ req, res }) => ({ req, res }),
    })
  );

  app.get("/", (_req, res) => res.send("<h1>JWT GraphQL Auth Server!</h1>"));
  app.post("/refresh_token", refreshToken);

  httpServer.listen(PORT, () => {
    console.log("Server started on port", PORT);
  });
})();
