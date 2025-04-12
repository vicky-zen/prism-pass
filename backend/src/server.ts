import { config } from "dotenv";
import express from "express";
import { DataSource } from "typeorm";
import routes from "./services/index.routes.js";
import * as entities from "./entities/index.js";
import * as Middleware from "./middleware/index.js";
import cors from "cors";
import { initialCaches } from "./cache/index.js";

config();

// Middleware.checkTimezone();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: true,
  entities,
  migrationsRun: true,
  maxQueryExecutionTime: 100000
});

AppDataSource.initialize()
  .then(async () => {
    try {
      const app = express();
      app.options("/", cors());
      Middleware.applyMiddleware(app);
      Middleware.applyRoutes(app, routes);
      app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running on port ${process.env.PORT || 3000}`);
      });

      await InitializeCache();
    } catch (error) {
      console.log(error);
    }
  })
  .catch((error) => console.log(error));

const InitializeCache = async () => {
  const promiseFun: Promise<unknown>[] = [];
  initialCaches.forEach((fun) => promiseFun.push(fun()));
  await Promise.allSettled(promiseFun);
  Middleware.logger.info("success", {
    type: "Information",
    subType: "initializeCache"
  });
};
