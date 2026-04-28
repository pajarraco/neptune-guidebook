// Minimal static file server for the production build.
//
// Behavior:
//   - Serves files from ../dist
//   - Requests to /locales/* require an `x-access-code` header (or `?code=`
//     query param) matching the ACCESS_CODE env var. Otherwise 401.
//   - Everything else is served statically with SPA fallback to index.html.
//
// This is light-touch security: anyone with browser devtools can still
// extract VITE_CODE from the bundle. The goal is to prevent /locales/*
// from being scraped by bots / random visitors who don't have the code.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "..", "dist");
const PORT = Number(process.env.PORT || 3000);
const ACCESS_CODE = process.env.ACCESS_CODE || process.env.VITE_CODE || "";

if (!ACCESS_CODE) {
  console.warn(
    "[server] WARNING: ACCESS_CODE / VITE_CODE not set — /locales/* will be unreachable.",
  );
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

function send(res, status, body, headers = {}) {
  res.writeHead(status, {
    "Content-Type": "text/plain; charset=utf-8",
    ...headers,
  });
  res.end(body);
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
  const rel = path.relative(parent, child);
  return rel && !rel.startsWith("..") && !path.isAbsolute(rel);
}

const server = http.createServer((req, res) => {
  let url;
  try {
    url = new URL(req.url, "http://localhost");
  } catch {
    return send(res, 400, "Bad request");
  }
  const pathname = decodeURIComponent(url.pathname);

  // Gate /locales/* behind the access code.
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
    // Locales should not be cached by intermediaries — they change at runtime.
    return serveFile(res, filePath, { noCache: true });
  }

  // Static + SPA fallback.
  const filePath = path.join(DIST, pathname);
  if (!isInside(filePath, DIST) && filePath !== DIST) {
    return send(res, 403, "Forbidden");
  }
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
  console.log(`[server] serving ${DIST} on http://0.0.0.0:${PORT}`);
});
