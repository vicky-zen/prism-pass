import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthToken } from "../models/api.js";

export function getJWTToken(
  payLoad: AuthToken,
  type: "login" | "email"
): string;

export function getJWTToken(
  payLoad: AuthToken | object,
  type: "login" | "email"
): string {
  const jwtKey = String(process.env.JWT_KEY);
  // const jwtExpiresIn = Number(
  //   type == "login"
  //     ? process.env.JWT_EXPIRY_SECONDS
  //     : process.env.JWT_EXPIRY_WEB
  // );
  return jwt.sign(payLoad, jwtKey, {
    algorithm: "HS512"
    // expiresIn: jwtExpiresIn
  });
}

type validateTokenType<T> = T & JwtPayload;
export function validateToken<T>(token: string): validateTokenType<T> {
  const jwtKey = String(process.env.JWT_KEY);
  return jwt.verify(token, jwtKey) as validateTokenType<T>;
}
