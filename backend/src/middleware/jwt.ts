import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthToken, getErrorRes } from "../common/index.js";
import { logger } from "./index.js";

export const JWTExcludePath = [
  "/",
  "/api/auth/login-or-register",
  "/api/auth/otp/verify",
  "/api/auth/otp/resend"
];

export async function validateJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (JWTExcludePath.includes(req.path)) return next();

  await checkToken(req, res, next);
}

export async function checkToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const jwtToken = req.headers["authorization"];

  if (!jwtToken) {
    const apiResponse = await jwtErrorHandling(req, ["JWT01"], req.path);
    logger.info("Token not supplied", {
      error: apiResponse.error ?? "",
      path: req.path
    });
    return res.status(401).send(apiResponse); // Unauthorized if token is missing
  }

  try {
    const authToken = jwt.verify(
      jwtToken,
      process.env.JWT_KEY ?? ""
    ) as AuthToken;

    if (!authToken || !authToken.userId || !authToken.email)
      throw new Error("Invalid token data");

    req.authToken = authToken;
    next();
  } catch (err) {
    if (err instanceof Error) {
      const apiResponse = await jwtErrorHandling(req, ["JWT01"], req.path);
      logger.info("Token expired or invalid", {
        error: apiResponse.error || err.message || ""
      });
      return res.status(401).send(apiResponse);
    }

    logger.info("An unknown error occurred while verifying the token", {
      error: "Unknown error"
    });
    return res.status(500).send({ error: "Internal server error" });
  }
}

const jwtErrorHandling = async (
  req: Request,
  errCode: string[],
  path: string
) => {
  return await getErrorRes({ errCode }, req, path);
};
