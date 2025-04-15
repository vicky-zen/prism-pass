import crypto from "crypto";
import fs from "fs";
import path from "path";

const RSA_PRIVATE_KEY = fs.readFileSync(
  path.resolve(process.env.RSA_PRIVATE_KEY_PATH!),
  "utf8"
);
const RSA_PUBLIC_KEY = fs.readFileSync(
  path.resolve(process.env.RSA_PUBLIC_KEY_PATH!),
  "utf8"
);

if (!RSA_PRIVATE_KEY) {
  throw new Error("Missing RSA_PRIVATE_KEY in environment variables.");
}

if (!RSA_PUBLIC_KEY) {
  throw new Error("Missing RSA_PUBLIC_KEY in environment variables.");
}

export function decryptRequestBody(body: any): any {
  const { encryptedKey, encryptedData, iv } = body;
  if (!encryptedKey || !encryptedData || !iv)
    throw new Error("Missing encryption fields");

  const aesKey = crypto.privateDecrypt(
    {
      key: RSA_PRIVATE_KEY!,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
    },
    Buffer.from(encryptedKey, "base64")
  );

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    aesKey,
    Buffer.from(iv, "base64")
  );
  let decrypted = decipher.update(Buffer.from(encryptedData, "base64"));
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return JSON.parse(decrypted.toString());
}

export function encryptResponseBody(data: any): any {
  const aesKey = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv("aes-256-cbc", aesKey, iv);
  let encrypted = cipher.update(JSON.stringify(data));
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  const encryptedKey = crypto.publicEncrypt(
    {
      key: RSA_PUBLIC_KEY!,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
    },
    aesKey
  );

  return {
    encryptedKey: encryptedKey.toString("base64"),
    encryptedData: encrypted.toString("base64"),
    iv: iv.toString("base64")
  };
}
