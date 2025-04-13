import { Request, Response } from "express";
import { getApiSuccessRes, getErrorRes } from "../../common/error.js";
import { IRoute, logger } from "../../middleware/index.js";
import { Timer } from "../../utils/timer.js";
import { NoteController } from "./note.controller.js";

export const NoteRoutes: IRoute[] = [
  {
    path: "/api/pass/note",
    method: "POST",
    handler: [
      async (req: Request, res: Response, doNothing) => {
        const timer = new Timer();
        timer.start();
        try {
          const controller = new NoteController(req.authToken);
          const data = await controller.saveNote(req.body);

          res.status(200).send(getApiSuccessRes(data));
        } catch (error) {
          res.status(200).send(await getErrorRes(error, req, "/api/pass/note"));
        } finally {
          logger.info("success", {
            timeMs: timer.stop(),
            type: "Timing",
            subType: "Create/Update Note"
          });
        }
      }
    ]
  }
];
