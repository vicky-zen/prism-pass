import crypto from "crypto";

export class AESEncryption {
  aesKey: string;
  constructor() {
    this.aesKey =
      process.env.ENCRYPT_KEY || "eCKQMQpCDr#KXYHzm1XNzNkFizk0vSeUp6exVHcf9NcN+g-";
  }

  private getKey() {
    const key = this.aesKey;
    if (key.length === 48) return key;
    if (key.length > 48) return key.substring(0, 48);
    return key.padEnd(48, "0");
  }

  encrypt(data: unknown) {
    const iv = crypto.randomBytes(16); // random initialization vector
    const salt = crypto.randomBytes(32); // random salt (16 or 32 bytes is sufficient)

    // derive encryption key (32 bytes)
    const key = crypto.pbkdf2Sync(this.getKey(), salt, 100000, 32, "sha512"); // increased iterations
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

    const encrypted = Buffer.concat([
      cipher.update(JSON.stringify(data), "utf8"),
      cipher.final(),
    ]);

    const tag = cipher.getAuthTag(); // extract the auth tag

    // generate output
    return Buffer.concat([salt, iv, tag, encrypted]).toString("base64");
  }

  decrypt(data: string) {
    const bData = Buffer.from(data, "base64");

    const salt = bData.slice(0, 32); // 32 bytes for salt
    const iv = bData.slice(32, 48); // 16 bytes for IV
    const tag = bData.slice(48, 64); // 16 bytes for auth tag
    const text = bData.slice(64); // the actual encrypted data

    const key = crypto.pbkdf2Sync(this.getKey(), salt, 100000, 32, "sha512");
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);

    try {
      const decrypted = Buffer.concat([
        decipher.update(text),
        decipher.final(),
      ]).toString("utf8");

      return JSON.parse(decrypted);
    } catch (error) {
      throw new Error("Decryption failed or data was tampered with.");
    }
  }
}
