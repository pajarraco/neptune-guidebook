# Admin Panel Rules

## Overview

The admin panel at `/admin` lets allowlisted Google accounts edit
locale JSON files directly on the server, without redeploys. It's a
separate Vite build at `src/admin/` served from `dist/admin/`.

## Architecture

```
Browser (/admin)
  │
  │  Google Identity Services → ID token
  ▼
POST /api/auth/google
  │  → server verifies token, checks ALLOWED_EMAILS,
  │    sets HMAC-signed session cookie
  ▼
Editor screens
  │  GET  /api/locales            list languages
  │  GET  /api/locales/:lang      read JSON
  │  PUT  /api/locales/:lang      write JSON (atomic)
  │  POST /api/sheets/pull        run pullSheetsToLocales()
  ▼
Volume: /app/dist/locales
```

## Server (`scripts/server.mjs` + `scripts/lib/`)

- `lib/auth.mjs` — session signing, Google ID token verification, email
  allowlist
- `lib/locales.mjs` — `listLanguages`, `readLanguage`, `writeLanguage`
  (atomic via temp-file rename)
- `lib/sheets.mjs` — `pullSheetsToLocales`, `transformToGuidebookFormat`
- `server.mjs` — HTTP routing + middleware + static file serving

### Request gating

| Path prefix                                            | Gate                                                   |
| ------------------------------------------------------ | ------------------------------------------------------ |
| `/api/auth/google`, `/api/auth/logout`, `/api/auth/me` | Open (set/clear/read session)                          |
| `/api/*` (everything else)                             | Requires valid session cookie                          |
| `/locales/*`                                           | Requires `x-access-code` header == `ACCESS_CODE`       |
| `/admin/*`                                             | Open static files (the SPA itself doesn't reveal data) |
| Everything else                                        | Open static files (the guest SPA)                      |

### Session cookies

- Name: `admin_session`
- Format: `<base64url(payload)>.<base64url(hmac)>` where
  `payload = { email, exp }`
- Algorithm: HMAC-SHA256 with `SESSION_SECRET`
- Flags: `HttpOnly`, `SameSite=Lax`, `Secure` (in production), 7-day TTL

## Required env vars

| Var                           | Type    | Why                                              |
| ----------------------------- | ------- | ------------------------------------------------ |
| `VITE_GOOGLE_OAUTH_CLIENT_ID` | Build   | Loaded by Google Identity Services in the bundle |
| `GOOGLE_OAUTH_CLIENT_ID`      | Runtime | Server verifies ID token audience                |
| `ALLOWED_EMAILS`              | Runtime | Comma-separated allowlist                        |
| `SESSION_SECRET`              | Runtime | HMAC key (≥16 chars; use `openssl rand -hex 32`) |
| `ACCESS_CODE`                 | Runtime | Gates `/locales/*` (must equal `VITE_CODE`)      |

`VITE_GOOGLE_OAUTH_CLIENT_ID` and `GOOGLE_OAUTH_CLIENT_ID` MUST be the
same value. The first is for the browser, the second for the server's
verification.

## Adding a new admin endpoint

1. Add a handler in `scripts/server.mjs` under `handleApi()`.
2. If it mutates state, require the session (already done by default
   for everything except the auth/\* routes).
3. Add a method to `src/admin/api.ts` so components don't call `fetch()`
   directly.
4. Validate inputs server-side; never trust the body.
5. For file writes, use `writeLanguage()` (atomic) — never partial writes.

## Adding form-based editors (planned, Phase 3)

The current `Editor.tsx` is a raw JSON textarea. The plan is one
typed form component per guidebook section, sharing primitives:

- `TextField`, `TextArea` — react-hook-form-bound inputs
- `StringArrayField` — array of strings with add/remove
- `ObjectArrayField` — array of objects with typed sub-fields
- One Zod schema per section (mirrors `types/types.ts`)

When introducing forms, **keep the raw editor as a fallback tab** so
power users can fix anything the forms don't expose.

## DO

- Use `api.ts` for every backend call.
- Treat `types/types.ts` as the canonical schema. If you change a
  guidebook field, update both this file and the corresponding section
  editor.
- Show success/error feedback for every mutating action.
- Confirm destructive actions (Pull from Sheets, etc.).
- Keep the admin English-only — no `useTranslation()` in `src/admin/`.

## DON'T

- Don't put credentials in the bundle. The OAuth client ID is fine;
  the OAuth client secret, service account JSON, and `SESSION_SECRET`
  must stay server-side only.
- Don't write to JSON files directly from the frontend. Always go
  through `PUT /api/locales/:lang`.
- Don't bypass the session check by adding routes outside
  `handleApi()`.
- Don't cache `/api/*` or `/locales/*` in the service worker
  (`public/sw.js` already excludes them).
