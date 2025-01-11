import forge from "node-forge";

// Generate a new AES key (128-bit AES)
function generateAESKey(): string {
  return forge.random.getBytesSync(16); // 128-bit AES key
}

// Encrypt data using AES (CBC mode)
function encryptDataWithAES(data: string, aesKey: string): string {
  const cipher = forge.cipher.createCipher("AES-CBC", aesKey);
  const iv = forge.random.getBytesSync(16); // Initialization vector
  cipher.start({ iv });
  cipher.update(forge.util.createBuffer(data));
  cipher.finish();
  return forge.util.encode64(iv + cipher.output.bytes()); // Prefix the iv to encrypted data
}

// Decrypt data using AES (CBC mode)
function decryptDataWithAES(encryptedData: string, aesKey: string): string {
  const encryptedBytes = forge.util.decode64(encryptedData);
  const iv = encryptedBytes.slice(0, 16); // Extract the IV from the encrypted data
  const encrypted = encryptedBytes.slice(16);

  const decipher = forge.cipher.createDecipher("AES-CBC", aesKey);
  decipher.start({ iv });
  decipher.update(forge.util.createBuffer(encrypted));
  decipher.finish();
  return decipher.output.toString();
}

export { generateAESKey, encryptDataWithAES, decryptDataWithAES };
