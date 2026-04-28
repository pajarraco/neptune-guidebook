// Authentication helpers for the admin API.
//
// Flow:
//  1. Browser obtains a Google ID token via Google Identity Services (GIS).
//  2. Browser POSTs the token to /api/auth/google.
//  3. Server verifies the token against Google's public keys.
//  4. Server checks the email against ALLOWED_EMAILS.
//  5. Server issues an HMAC-signed session cookie (HTTP-only, SameSite=Lax).
//  6. Subsequent /api/* requests include the cookie.
//
// Session format: `<base64url(payload)>.<base64url(hmac)>`
// where payload = { email, exp } (exp is a unix seconds timestamp).
import crypto from "node:crypto";
import { OAuth2Client } from "google-auth-library";

const SESSION_COOKIE = "admin_session";
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

function b64urlEncode(buf) {
  return Buffer.from(buf)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function b64urlDecode(str) {
  const pad = "=".repeat((4 - (str.length % 4)) % 4);
  return Buffer.from(str.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64");
}

function getSecret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) {
    throw new Error(
      "SESSION_SECRET env var is required (>=16 chars). Generate with: openssl rand -hex 32",
    );
  }
  return s;
}

function getAllowedEmails() {
  const raw = process.env.ALLOWED_EMAILS || "";
  return new Set(
    raw
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function isEmailAllowed(email) {
  if (!email) return false;
  return getAllowedEmails().has(String(email).toLowerCase());
}

function hmac(data) {
  return crypto.createHmac("sha256", getSecret()).update(data).digest();
}

export function signSession({ email }) {
  const payload = JSON.stringify({
    email,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  });
  const encoded = b64urlEncode(payload);
  const sig = b64urlEncode(hmac(encoded));
  return `${encoded}.${sig}`;
}

export function verifySession(cookieValue) {
  if (!cookieValue) return null;
  const [encoded, sig] = cookieValue.split(".");
  if (!encoded || !sig) return null;
  const expected = b64urlEncode(hmac(encoded));
  // Constant-time compare.
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  let payload;
  try {
    payload = JSON.parse(b64urlDecode(encoded).toString("utf8"));
  } catch {
    return null;
  }
  if (!payload.email || !payload.exp) return null;
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;
  if (!isEmailAllowed(payload.email)) return null;
  return { email: payload.email };
}

export function parseCookies(header) {
  const out = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    out[k] = decodeURIComponent(v);
  }
  return out;
}

export function getSessionFromReq(req) {
  const cookies = parseCookies(req.headers.cookie);
  return verifySession(cookies[SESSION_COOKIE]);
}

export function sessionCookieHeader(value, { clear = false } = {}) {
  const parts = [`${SESSION_COOKIE}=${value}`, "Path=/", "HttpOnly", "SameSite=Lax"];
  if (process.env.NODE_ENV !== "development") parts.push("Secure");
  if (clear) parts.push("Max-Age=0");
  else parts.push(`Max-Age=${SESSION_TTL_SECONDS}`);
  return parts.join("; ");
}

export async function verifyGoogleIdToken(idToken) {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  if (!clientId) {
    throw new Error("GOOGLE_OAUTH_CLIENT_ID env var is not set");
  }
  const client = new OAuth2Client(clientId);
  const ticket = await client.verifyIdToken({ idToken, audience: clientId });
  const payload = ticket.getPayload();
  if (!payload) throw new Error("Invalid Google ID token");
  if (!payload.email_verified) throw new Error("Google email not verified");
  return { email: payload.email, name: payload.name, picture: payload.picture };
}

export { SESSION_COOKIE };
