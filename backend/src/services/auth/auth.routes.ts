import { Request, Response } from "express";
import { AuthController } from "./auth.controller.js";
import { IRoute } from "../../middleware/index.js";

export const AuthRoutes: IRoute[] = [
  {
    path: "/api/auth/create",
    method: "POST",
    handler: (req: Request, res: Response, doNothing) => {
      try {
        const userIP =
          req.ip ||
          req.headers["x-forwarded-for"] ||
          req.connection.remoteAddress;

        const controller = new AuthController();
        controller.createUser(req.body, userIP);
        res.status(201).send({ message: "User created successfully" });
      } catch (error) {
        res.status(400).send({ message: "Error creating user" });
      }
    }
  }
];
