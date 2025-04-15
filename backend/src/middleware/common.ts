import parser from "body-parser";
import compression from "compression";
import cors from "cors";
import { Express, NextFunction } from "express";
import helmet from "helmet";
import { validateJWT } from "./jwt.js";
import { hybridDecrypt } from "./hybridDecrypt.js";

export function doNothing(next: NextFunction) {
  next();
}

export function handleHelmet(app: Express) {
  app.use(helmet());
}

export function handleCors(app: Express) {
  app.use(cors());
}

export function handleBodyRequestParsing(app: Express) {
  app.use(
    parser.urlencoded({
      limit: "1mb",
      extended: true
    })
  );
  app.use(
    parser.json({
      limit: "20mb"
    })
  );
}

export function handleCompression(app: Express) {
  app.use(compression());
}

export function handleJWT(app: Express) {
  app.use(validateJWT);
}

export function handleHybridDecrypt(app: Express) {
  app.use(hybridDecrypt);
}
