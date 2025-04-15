import forge from "node-forge";
import { ValueTransformer } from "typeorm";

const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY || "NDmwfEjNZK5RP+i9xLpxQEt1ZzLEvMHTIfJ5q3P4UQw=";

const key = forge.util.decode64(ENCRYPTION_KEY);

if (key.length < 32) {
  throw new Error("ENCRYPTION_KEY must be 32 characters long for AES-256");
}

export function encrypt(text: string): string {
  const iv = forge.random.getBytesSync(16);
  const cipher = forge.cipher.createCipher("AES-CBC", key);
  cipher.start({ iv });
  cipher.update(forge.util.createBuffer(text, "utf8"));
  cipher.finish();
  const encrypted = cipher.output.getBytes();

  return forge.util.encode64(iv + encrypted); // return base64 string
}

export function decrypt(encryptedBase64: string): string {
  const encryptedBytes = forge.util.decode64(encryptedBase64);
  const iv = encryptedBytes.slice(0, 16);
  const encrypted = encryptedBytes.slice(16);

  const decipher = forge.cipher.createDecipher("AES-CBC", key);
  decipher.start({ iv });
  decipher.update(forge.util.createBuffer(encrypted));
  const result = decipher.finish();

  if (!result) {
    throw new Error("Decryption failed.");
  }

  return decipher.output.toString();
}

export const EncryptedTransformer: ValueTransformer = {
  to: (value?: string | null): string | null => {
    return value ? encrypt(value) : null;
  },
  from: (value?: string | null): string | null => {
    return value ? decrypt(value) : null;
  }
};
