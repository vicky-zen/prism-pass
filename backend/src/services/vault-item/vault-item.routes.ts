import { Request, Response } from "express";
import { getApiSuccessRes, getErrorRes } from "../../common/error.js";
import { IRoute, logger } from "../../middleware/index.js";
import { Timer } from "../../utils/timer.js";
import { VaultItemController } from "./vault-item.controller.js";

export const VaultItemRoutes: IRoute[] = [
  {
    path: "/api/pass/vault-items/soft-delete",
    method: "POST",
    handler: [
      async (req: Request, res: Response, doNothing) => {
        const timer = new Timer();
        timer.start();

        try {
          const controller = new VaultItemController(req.authToken);
          const result = await controller.softDeleteItems(req.body);

          res.status(200).send(getApiSuccessRes(result));
        } catch (err) {
          res
            .status(200)
            .send(
              await getErrorRes(err, req, "/api/pass/vault-items/soft-delete")
            );
        } finally {
          logger.info("success", {
            timeMs: timer.stop(),
            type: "Timing",
            subType: "Soft Delete Vault Items"
          });
        }
      }
    ]
  },
  {
    path: "/api/pass/vault-items/restore",
    method: "POST",
    handler: [
      async (req: Request, res: Response, doNothing) => {
        const timer = new Timer();
        timer.start();

        try {
          const controller = new VaultItemController(req.authToken);
          const result = await controller.restoreItems(req.body);

          res.status(200).send(getApiSuccessRes(result));
        } catch (err) {
          res
            .status(200)
            .send(await getErrorRes(err, req, "/api/pass/vault-items/restore"));
        } finally {
          logger.info("success", {
            timeMs: timer.stop(),
            type: "Timing",
            subType: "Restore Vault Items"
          });
        }
      }
    ]
  },
  {
    path: "/api/pass/vault-items/permanent-delete",
    method: "POST",
    handler: [
      async (req: Request, res: Response, doNothing) => {
        const timer = new Timer();
        timer.start();

        try {
          const controller = new VaultItemController(req.authToken);
          const result = await controller.permanentlyDeleteItems(req.body);

          res.status(200).send(getApiSuccessRes(result));
        } catch (err) {
          res
            .status(200)
            .send(
              await getErrorRes(
                err,
                req,
                "/api/pass/vault-items/permanent-delete"
              )
            );
        } finally {
          logger.info("success", {
            timeMs: timer.stop(),
            type: "Timing",
            subType: "Permanently Delete Vault Items"
          });
        }
      }
    ]
  }
];
