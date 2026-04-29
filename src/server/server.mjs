// Production server.
//
// Serves:
//   /                  → guest SPA (dist/)
//   /admin             → admin SPA (dist/admin/)
//   /locales/:lang.json → gated by `x-access-code` header (header must equal ACCESS_CODE)
//   /api/*             → admin REST API, gated by HMAC session cookie
import http from "node:http";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  SESSION_COOKIE,
  getSessionFromReq,
  isEmailAllowed,
  parseCookies,
  sessionCookieHeader,
  signSession,
  verifyGoogleIdToken,
} from "./lib/auth.mjs";
import { listLanguages, readLanguage, writeLanguage } from "./lib/locales.mjs";
import { pullSheetsToLocales } from "./lib/sheets.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "..", "..", "dist");
const ADMIN_DIST = path.resolve(DIST, "admin");
const PORT = Number(process.env.PORT || 3000);
const ACCESS_CODE = process.env.ACCESS_CODE || process.env.VITE_CODE || "";

if (!ACCESS_CODE) {
  console.warn("[server] WARNING: ACCESS_CODE / VITE_CODE not set");
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".webmanifest": "application/manifest+json",
};

// ---------- Response helpers ----------
function send(res, status, body, headers = {}) {
  res.writeHead(status, {
    "Content-Type": "text/plain; charset=utf-8",
    ...headers,
  });
  res.end(body);
}

function sendJson(res, status, obj, headers = {}) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...headers,
  });
  res.end(JSON.stringify(obj));
}

function serveFile(res, filePath, { noCache = false } = {}) {
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) return send(res, 404, "Not found");
    const type = MIME[path.extname(filePath)] || "application/octet-stream";
    res.writeHead(200, {
      "Content-Type": type,
      "Cache-Control": noCache
        ? "no-store, must-revalidate"
        : "public, max-age=3600",
    });
    fs.createReadStream(filePath).pipe(res);
  });
}

function isInside(child, parent) {
  const c = path.resolve(child);
  const p = path.resolve(parent);
  return c === p || c.startsWith(p + path.sep);
}

async function readJsonBody(req, { limit = 1024 * 1024 } = {}) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (c) => {
      size += c.length;
      if (size > limit) {
        reject(new Error("Payload too large"));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8") || "{}";
        resolve(JSON.parse(raw));
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

// ---------- API handlers ----------
async function apiAuthGoogle(req, res) {
  let body;
  try {
    body = await readJsonBody(req);
  } catch {
    return sendJson(res, 400, { error: "Invalid JSON body" });
  }
  const idToken = body.idToken || body.credential;
  if (!idToken) return sendJson(res, 400, { error: "Missing idToken" });
  let info;
  try {
    info = await verifyGoogleIdToken(idToken);
  } catch (e) {
    return sendJson(res, 401, { error: e.message });
  }
  if (!isEmailAllowed(info.email)) {
    return sendJson(res, 403, { error: "Email not allowed" });
  }
  const session = signSession({ email: info.email });
  res.setHeader("Set-Cookie", sessionCookieHeader(session));
  sendJson(res, 200, {
    email: info.email,
    name: info.name,
    picture: info.picture,
  });
}

function apiAuthLogout(_req, res) {
  res.setHeader("Set-Cookie", sessionCookieHeader("", { clear: true }));
  sendJson(res, 200, { ok: true });
}

function apiAuthMe(req, res) {
  const sess = getSessionFromReq(req);
  if (!sess) return sendJson(res, 401, { error: "Not authenticated" });
  sendJson(res, 200, { email: sess.email });
}

async function apiListLocales(_req, res) {
  const data = await listLanguages();
  sendJson(res, 200, data);
}

async function apiReadLocale(_req, res, { lang }) {
  try {
    const data = await readLanguage(lang);
    sendJson(res, 200, data);
  } catch (e) {
    sendJson(res, 404, { error: `Language ${lang} not found: ${e.message}` });
  }
}

async function apiWriteLocale(req, res, { lang }) {
  let body;
  try {
    body = await readJsonBody(req, { limit: 5 * 1024 * 1024 });
  } catch {
    return sendJson(res, 400, { error: "Invalid JSON body" });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return sendJson(res, 400, { error: "Body must be a JSON object" });
  }
  await writeLanguage(lang, body);
  sendJson(res, 200, { ok: true, lang });
}

async function apiSheetsPull(_req, res) {
  try {
    const results = await pullSheetsToLocales({});
    sendJson(res, 200, { ok: true, results });
  } catch (e) {
    sendJson(res, 500, { error: e.message });
  }
}

// ---------- Router ----------
async function handleApi(req, res, pathname) {
  // Auth endpoints don't require an existing session, except logout/me which return 401.
  if (req.method === "POST" && pathname === "/api/auth/google")
    return apiAuthGoogle(req, res);
  if (req.method === "POST" && pathname === "/api/auth/logout")
    return apiAuthLogout(req, res);
  if (req.method === "GET" && pathname === "/api/auth/me")
    return apiAuthMe(req, res);

  // All other /api/* require a valid session.
  const sess = getSessionFromReq(req);
  if (!sess) return sendJson(res, 401, { error: "Not authenticated" });

  if (req.method === "GET" && pathname === "/api/locales")
    return apiListLocales(req, res);

  const localeMatch = pathname.match(
    /^\/api\/locales\/([a-zA-Z][a-zA-Z0-9_-]*)$/,
  );
  if (localeMatch) {
    const lang = localeMatch[1];
    if (req.method === "GET") return apiReadLocale(req, res, { lang });
    if (req.method === "PUT") return apiWriteLocale(req, res, { lang });
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  if (req.method === "POST" && pathname === "/api/sheets/pull")
    return apiSheetsPull(req, res);

  return sendJson(res, 404, { error: "Not found" });
}

// ---------- Main handler ----------
const server = http.createServer(async (req, res) => {
  let url;
  try {
    url = new URL(req.url, "http://localhost");
  } catch {
    return send(res, 400, "Bad request");
  }
  const pathname = decodeURIComponent(url.pathname);

  // /api/* — admin REST.
  if (pathname.startsWith("/api/")) {
    try {
      return await handleApi(req, res, pathname);
    } catch (e) {
      console.error("[api error]", e);
      return sendJson(res, 500, { error: "Internal error" });
    }
  }

  // /locales/* — gated guest content.
  if (pathname.startsWith("/locales/")) {
    const provided =
      req.headers["x-access-code"] || url.searchParams.get("code");
    if (!ACCESS_CODE || provided !== ACCESS_CODE) {
      return send(res, 401, "Unauthorized");
    }
    const filePath = path.join(DIST, pathname);
    if (!isInside(filePath, path.join(DIST, "locales"))) {
      return send(res, 403, "Forbidden");
    }
    return serveFile(res, filePath, { noCache: true });
  }

  // /admin/* — admin SPA static + fallback.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const rel = pathname.replace(/^\/admin/, "") || "/";
    const filePath = path.join(ADMIN_DIST, rel);
    if (!isInside(filePath, ADMIN_DIST)) return send(res, 403, "Forbidden");
    fs.stat(filePath, (err, stat) => {
      if (err || !stat.isFile()) {
        return serveFile(res, path.join(ADMIN_DIST, "index.html"), {
          noCache: true,
        });
      }
      serveFile(res, filePath, {
        noCache: filePath.endsWith(`${path.sep}index.html`),
      });
    });
    return;
  }

  // Guest SPA + SPA fallback.
  const filePath = path.join(DIST, pathname);
  if (!isInside(filePath, DIST)) return send(res, 403, "Forbidden");
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      return serveFile(res, path.join(DIST, "index.html"), { noCache: true });
    }
    serveFile(res, filePath, {
      noCache: filePath.endsWith(`${path.sep}index.html`),
    });
  });
});

server.listen(PORT, () => {
  console.log(`[server] guest=${DIST}`);
  console.log(`[server] admin=${ADMIN_DIST}`);
  console.log(`[server] listening on :${PORT}`);
});

// Silence unused import warnings for SESSION_COOKIE / parseCookies / fsp;
// they may be useful to consumers extending this file.
void SESSION_COOKIE;
void parseCookies;
void fsp;
