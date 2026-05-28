import crypto from "node:crypto";

export const TOKEN_PREFIX = "cpx_sk_";

// Generate a new personal access token (plaintext) and its storage hash.
export function generateToken() {
  const secret = crypto.randomBytes(24).toString("hex"); // 48 hex chars
  const token = `${TOKEN_PREFIX}${secret}`;
  return { token, hash: hashToken(token) };
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
