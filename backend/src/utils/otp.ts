import crypto from "crypto";

interface OTPOptions {
  length: number;
  includeDigits: boolean;
  includeLowercase?: boolean;
  includeUppercase?: boolean;
  includeSpecialChars?: boolean;
}

// Character sets
const digits = "0123456789";
const lowercase = "abcdefghijklmnopqrstuvwxyz";
const uppercase = lowercase.toUpperCase();
const specialChars = "#!&@";

/**
 * Generate a password based on the provided options.
 * @param  {number} options.length - Length of the password (default: 6).
 * @param  {boolean} options.includeDigits - Include digits (default: true).
 * @param  {boolean} options.includeLowercase - Include lowercase letters (default: false).
 * @param  {boolean} options.includeUppercase - Include uppercase letters (default: false).
 * @param  {boolean} options.includeSpecialChars - Include special characters (default: false).
 * @returns {string} - Generated OTP.
 */
export function generateOTP(
  options: OTPOptions = {
    length: 6,
    includeDigits: true,
    includeLowercase: false,
    includeUppercase: false,
    includeSpecialChars: false
  }
): string {
  let charPool = "";
  if (options.includeDigits) charPool += digits;
  if (options.includeLowercase) charPool += lowercase;
  if (options.includeUppercase) charPool += uppercase;
  if (options.includeSpecialChars) charPool += specialChars;

  let otp = "";
  while (otp.length < length) {
    const randomChar = charPool[crypto.randomInt(0, charPool.length)];

    // Ensure the password does not start with '0' if digits are included
    if (otp.length === 0 && options.includeDigits && randomChar === "0") {
      continue;
    }

    otp += randomChar;
  }

  return otp;
}
