import crypto from "crypto";

/**
 * Hash password using Node.js built-in scrypt cryptographic algorithm.
 */
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return {
    salt,
    hash: derivedKey.toString("hex")
  };
}

/**
 * Verify password against stored salt and hash.
 */
export function verifyPassword(password, salt, storedHash) {
  const key = crypto.scryptSync(password, salt, 64);
  const keyBuffer = Buffer.from(key.toString("hex"), "hex");
  const storedBuffer = Buffer.from(storedHash, "hex");
  
  if (keyBuffer.length !== storedBuffer.length) {
    return false;
  }
  return crypto.timingSafeEqual(keyBuffer, storedBuffer);
}

/**
 * Generate secure session token.
 */
export function generateSessionId() {
  return crypto.randomBytes(32).toString("hex");
}
