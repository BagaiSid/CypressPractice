/**
 * Credential Encryption / Decryption Utility
 *
 * Uses AES-256-GCM (Node.js built-in crypto) to protect sensitive
 * fixture data.  The encryption key is read from the environment
 * variable CREDENTIALS_KEY (or Cypress.env("credentialsKey")).
 *
 * Encrypted format:  "enc:<iv>:<authTag>:<ciphertext>"  (all hex)
 */
const crypto = require("crypto");

const ALGO = "aes-256-gcm";
const ENC_PREFIX = "enc:";

/**
 * Derive a 32-byte key from an arbitrary passphrase.
 */
function deriveKey(passphrase) {
  return crypto.createHash("sha256").update(String(passphrase)).digest();
}

/**
 * Encrypt a plaintext string.
 * @param {string} plaintext
 * @param {string} passphrase
 * @returns {string} "enc:<iv>:<authTag>:<ciphertext>"
 */
function encrypt(plaintext, passphrase) {
  const key = deriveKey(passphrase);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");
  return `${ENC_PREFIX}${iv.toString("hex")}:${authTag}:${encrypted}`;
}

/**
 * Decrypt a string produced by encrypt().
 * Returns the original plaintext, or the input unchanged if it's
 * not in encrypted format.
 * @param {string} value
 * @param {string} passphrase
 * @returns {string}
 */
function decrypt(value, passphrase) {
  if (typeof value !== "string" || !value.startsWith(ENC_PREFIX)) {
    return value; // not encrypted – return as-is
  }
  const parts = value.slice(ENC_PREFIX.length).split(":");
  if (parts.length !== 3) return value;

  const [ivHex, authTagHex, cipherHex] = parts;
  const key = deriveKey(passphrase);
  const decipher = crypto.createDecipheriv(
    ALGO,
    key,
    Buffer.from(ivHex, "hex")
  );
  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));
  let decrypted = decipher.update(cipherHex, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

/**
 * Recursively decrypt all string values in an object/array.
 */
function decryptAll(obj, passphrase) {
  if (typeof obj === "string") return decrypt(obj, passphrase);
  if (Array.isArray(obj)) return obj.map((v) => decryptAll(v, passphrase));
  if (obj && typeof obj === "object") {
    const result = {};
    for (const [k, v] of Object.entries(obj)) {
      result[k] = decryptAll(v, passphrase);
    }
    return result;
  }
  return obj;
}

module.exports = { encrypt, decrypt, decryptAll, ENC_PREFIX };
