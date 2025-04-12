import { Request, Response } from "express";
import { AuthController } from "./auth.controller.js";
import { IRoute, logger } from "../../middleware/index.js";
import { Timer } from "../../utils/timer.js";
import { getApiSuccessRes, getErrorRes } from "../../common/error.js";

export const AuthRoutes: IRoute[] = [
  {
    path: "/api/auth/login-or-register",
    method: "POST",
    handler: [
      async (req: Request, res: Response, doNothing) => {
        const timer = new Timer();
        timer.start();
        try {
          const userIP =
            req.ip ||
            req.headers["x-forwarded-for"] ||
            req.connection.remoteAddress;

          const controller = new AuthController();
          const data = await controller.loginOrRegisterUser(req.body, userIP);

          const response = getApiSuccessRes(data);
          res.status(200).send(response);
        } catch (error) {
          const response = await getErrorRes(
            error,
            req,
            "/api/auth/login-or-register"
          );
          res.status(200).send(response);
        } finally {
          logger.info("success", {
            timeMs: timer.stop(),
            type: "Timing",
            subType: "Login-Or-Register User"
          });
        }
      }
    ]
  },
  {
    path: "/api/auth/otp/verify",
    method: "POST",
    handler: [
      async (req: Request, res: Response, doNothing) => {
        const timer = new Timer();
        timer.start();
        try {
          const controller = new AuthController();
          const data = await controller.verifyOTP(req.body, req.ip);

          const response = getApiSuccessRes(data);
          res.status(200).send(response);
        } catch (error) {
          const response = await getErrorRes(
            error,
            req,
            "/api/auth/opt/verify"
          );
          res.status(200).send(response);
        } finally {
          logger.info("success", {
            timeMs: timer.stop(),
            type: "Timing",
            subType: "Verify User OTP"
          });
        }
      }
    ]
  },
  {
    path: "/api/auth/otp/resend",
    method: "POST",
    handler: async (req: Request, res: Response) => {
      const timer = new Timer();
      timer.start();
      try {
        const controller = new AuthController();
        const data = await controller.resendOTP(req.body, req.ip);

        const response = getApiSuccessRes(data);
        res.status(200).send(response);
      } catch (err) {
        const response = await getErrorRes(err, req, "/api/auth/otp/resend");
        res.status(200).send(response);
      } finally {
        logger.info("success", {
          timeMs: timer.stop(),
          type: "Timing",
          subType: "get all saas user"
        });
      }
    }
  }
];
