// routes/login.routes.ts
import { Request, Response } from "express";
import { getApiSuccessRes, getErrorRes } from "../../common/error.js";
import { IRoute, logger } from "../../middleware/index.js";
import { Timer } from "../../utils/timer.js";
import { LoginController } from "./login.controller.js";

export const LoginRoutes: IRoute[] = [
  {
    path: "/api/pass/login",
    method: "POST",
    handler: [
      async (req: Request, res: Response) => {
        const timer = new Timer();
        timer.start();
        try {
          const controller = new LoginController(req.authToken);
          const data = await controller.saveLogin(req.body);

          res.status(200).send(getApiSuccessRes(data));
        } catch (error) {
          res
            .status(400)
            .send(await getErrorRes(error, req, "/api/pass/login"));
        } finally {
          logger.info("success", {
            timeMs: timer.stop(),
            type: "Timing",
            subType: "Create/Update Login"
          });
        }
      }
    ]
  }
];
