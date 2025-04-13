import { Request, Response } from "express";
import { getApiSuccessRes, getErrorRes } from "../../common/error.js";
import { IRoute, logger } from "../../middleware/index.js";
import { Timer } from "../../utils/timer.js";
import { CardController } from "./card.controller.js";

export const CardRoutes: IRoute[] = [
  {
    path: "/api/pass/card",
    method: "POST",
    handler: [
      async (req: Request, res: Response, doNothing) => {
        const timer = new Timer();
        timer.start();
        try {
          const controller = new CardController(req.authToken);
          const data = await controller.saveCardDetails(req.body);

          const response = getApiSuccessRes(data);
          res.status(200).send(response);
        } catch (error) {
          const response = await getErrorRes(error, req, "/api/pass/card");
          res.status(200).send(response);
        } finally {
          logger.info("success", {
            timeMs: timer.stop(),
            type: "Timing",
            subType: "Create Card Details"
          });
        }
      }
    ]
  }
];
