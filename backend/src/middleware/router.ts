import { Express, NextFunction, Request, Response, Router } from "express";
import * as Handler from "./common.js";

type Handler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

export interface IRoute {
  path: string;
  method: "POST" | "GET" | "PUT" | "DELETE";
  handler: Handler | Handler[];
}

export function applyMiddleware(app: Express) {
  const middlewareWrappers = [
    Handler.handleCors,
    Handler.handleBodyRequestParsing,
    Handler.handleCompression,
    Handler.handleHelmet,
    Handler.handleJWT,
    Handler.handleHybridDecrypt
  ];

  for (const wrapper of middlewareWrappers) {
    wrapper(app);
  }
}

export function applyRoutes(router: Router, routes: IRoute[]) {
  routes.forEach((route) => {
    switch (route.method) {
      case "GET":
        router.get(route.path, route.handler);
        break;
      case "POST":
        router.post(route.path, route.handler);
        break;
      case "PUT":
        router.put(route.path, route.handler);
        break;
      case "DELETE":
        router.delete(route.path, route.handler);
        break;

      default:
        break;
    }
  });
}
