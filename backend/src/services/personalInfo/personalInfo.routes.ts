import { Request, Response } from "express";
import { getApiSuccessRes, getErrorRes } from "../../common/error.js";
import { Timer } from "../../utils/timer.js";
import { PersonalInfoController } from "./personalInfo.controller.js";
import { logger } from "../../middleware/logger.js";
import { IRoute } from "../../middleware/router.js";

export const PersonalInfoRoutes: IRoute[] = [
  {
    path: "/api/pass/personal-info",
    method: "POST",
    handler: [
      async (req: Request, res: Response, doNothing) => {
        const timer = new Timer();
        timer.start();
        try {
          const controller = new PersonalInfoController(req.authToken);
          const data = await controller.savePersonalInfo(req.body);

          res.status(200).send(getApiSuccessRes(data));
        } catch (error) {
          res
            .status(200)
            .send(await getErrorRes(error, req, "/api/pass/personal-info"));
        } finally {
          logger.info("success", {
            timeMs: timer.stop(),
            type: "Timing",
            subType: "Save Personal Info"
          });
        }
      }
    ]
  }
];
