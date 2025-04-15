import { Request, Response } from "express";
import { getApiSuccessRes, getErrorRes } from "../../common/error.js";
import { Timer } from "../../utils/timer.js";
import { VaultController } from "./vault.controller.js";
import { logger } from "../../middleware/logger.js";
import { IRoute } from "../../middleware/router.js";
import { sendEncryptedResponse } from "../../middleware/hybridDecrypt.js";

export const VaultRoutes: IRoute[] = [
  {
    path: "/api/pass/vault",
    method: "POST",
    handler: [
      async (req: Request, res: Response, doNothing) => {
        const timer = new Timer();
        timer.start();
        try {
          const controller = new VaultController(req.authToken);
          const data = await controller.saveVault(req.body);

          res.status(200).send(getApiSuccessRes(data));
        } catch (error) {
          res
            .status(200)
            .send(await getErrorRes(error, req, "/api/pass/vault"));
        } finally {
          logger.info("success", {
            timeMs: timer.stop(),
            type: "Timing",
            subType: "Create/Update Vault"
          });
        }
      }
    ]
  },
  {
    path: "/api/pass/vault",
    method: "GET",
    handler: [
      async (req: Request, res: Response, doNothing) => {
        const timer = new Timer();
        timer.start();
        try {
          const controller = new VaultController(req.authToken);
          const data = await controller.getActiveVaults();

          sendEncryptedResponse(res, getApiSuccessRes(data));
        } catch (error) {
          res
            .status(200)
            .send(await getErrorRes(error, req, "/api/pass/vault"));
        } finally {
          logger.info("success", {
            timeMs: timer.stop(),
            type: "Timing",
            subType: "Get Active Vaults"
          });
        }
      }
    ]
  },
  {
    path: "/api/pass/vault/:id",
    method: "GET",
    handler: [
      async (req: Request, res: Response, doNothing) => {
        const timer = new Timer();
        timer.start();
        try {
          const controller = new VaultController(req.authToken);
          const data = await controller.getVaultById(req.params.id);

          sendEncryptedResponse(res, getApiSuccessRes(data));
        } catch (error) {
          res
            .status(200)
            .send(
              await getErrorRes(error, req, `/api/pass/vault/${req.params.id}`)
            );
        } finally {
          logger.info("success", {
            timeMs: timer.stop(),
            type: "Timing",
            subType: "Get Vault By ID"
          });
        }
      }
    ]
  },
  {
    path: "/api/pass/vault",
    method: "DELETE",
    handler: [
      async (req: Request, res: Response, doNothing) => {
        const timer = new Timer();
        timer.start();
        try {
          const controller = new VaultController(req.authToken);
          const data = await controller.deleteVault(req.body);

          res.status(200).send(getApiSuccessRes(data));
        } catch (error) {
          res
            .status(400)
            .send(await getErrorRes(error, req, "/api/pass/vault"));
        } finally {
          logger.info("success", {
            timeMs: timer.stop(),
            type: "Timing",
            subType: "Delete Vault"
          });
        }
      }
    ]
  }
];
