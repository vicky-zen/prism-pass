import fs from "fs";
import path from "path";

let commonPasswords = new Set<string>();

export function loadCommonPasswords(filePath: string): void {
  const fullPath = path.resolve(filePath);
  const contents = fs.readFileSync(fullPath, "utf-8");
  const lines = contents
    .split(/\r?\n/)
    .map((line) => line.trim().toLowerCase())
    .filter(Boolean);

  commonPasswords = new Set(lines);
}

export function isCommonPassword(password: string): boolean {
  return commonPasswords.has(password.toLowerCase());
}
