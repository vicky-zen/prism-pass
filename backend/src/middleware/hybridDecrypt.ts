import { NextFunction, Request, Response } from "express";
import { decryptRequestBody, encryptResponseBody } from "../utils/index.js";

const encryptedRoutes = [
  { method: "POST", path: "/api/pass/card" },
  { method: "POST", path: "/api/pass/login" },
  { method: "POST", path: "/api/pass/note" },
  { method: "POST", path: "/api/pass/personal-info" }
  // { method: "POST", path: "/api/pass/vault" },
  // { method: "POST", path: "/api/pass/vault-items/pin" },
  // { method: "POST", path: "/api/pass/vault-items/soft-delete" },
  // { method: "POST", path: "/api/pass/vault-items/restore" },
  // { method: "POST", path: "/api/pass/vault-items/permanent-delete" }
];

function isEncryptedRoute(req: Request) {
  return encryptedRoutes.some(
    (r) => r.method === req.method && req.path === r.path
  );
}

export function hybridDecrypt(req: Request, res: Response, next: NextFunction) {
  if (!isEncryptedRoute(req)) return next();

  try {
    req.body = decryptRequestBody(req.body);
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid encrypted request" });
  }
}

export function sendEncryptedResponse(res: Response, data: any) {
  const encrypted = encryptResponseBody(data);
  res.status(200).json(encrypted);
}
