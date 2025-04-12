import forge from "node-forge";

// Encrypt data using the Client's Public Key (RSA)
function encryptDataWithRSA(data: string, clientPublicKeyPem: string): string {
  const publicKey = forge.pki.publicKeyFromPem(clientPublicKeyPem);
  const encrypted = publicKey.encrypt(data, "RSA-OAEP");
  return forge.util.encode64(encrypted);
}

// Decrypt data using the Server's Private Key (RSA)
function decryptDataWithRSA(encryptedData: string): string {
  const privateKey = forge.pki.privateKeyFromPem("serverPrivateKeyPem");
  const encrypted = forge.util.decode64(encryptedData);
  return privateKey.decrypt(encrypted, "RSA-OAEP");
}
