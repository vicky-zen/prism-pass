import { isCommonPassword } from "./passwordUtils.js";

export enum PasswordStrength {
  vulnerable = "vulnerable",
  weak = "weak",
  strong = "strong"
}

export function evaluatePasswordStrength(password: string): PasswordStrength {
  if (!password || typeof password !== "string") {
    return PasswordStrength.vulnerable;
  }

  const length = password.length;
  if (length < 4 || length > 64) {
    return PasswordStrength.vulnerable;
  }

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const charSetCount = [hasLower, hasUpper, hasDigit, hasSpecial].filter(
    Boolean
  ).length;

  const lowerPassword = password.toLowerCase();
  const hasRepetition = /(.)\1{2,}/.test(password); // e.g., aaa, 111
  const hasSequential = /(abc|123|qwerty|password|asdf|zxcv)/.test(
    lowerPassword
  );

  if (isCommonPassword(password)) {
    return PasswordStrength.vulnerable;
  }

  // Entropy scoring
  let entropyScore = length;
  entropyScore += hasLower ? 1 : 0;
  entropyScore += hasUpper ? 2 : 0;
  entropyScore += hasDigit ? 2 : 0;
  entropyScore += hasSpecial ? 3 : 0;
  entropyScore -= hasRepetition ? 2 : 0;
  entropyScore -= hasSequential ? 2 : 0;

  if (entropyScore < 12) return PasswordStrength.vulnerable;
  if (entropyScore < 18) return PasswordStrength.weak;
  return PasswordStrength.strong;
}
