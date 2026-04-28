# Neptune Guidebook

A modern, interactive digital guidebook for vacation rental properties built with React, TypeScript, and Vite.

## Features

- Access code entry for guest visitors
- Mobile-friendly responsive design (installable as a PWA)
- Multi-language support (English, Spanish, French, Italian)
- Property information, amenities, local guide, emergency info
- Dynamic content from Google Sheets
- Admin panel at `/admin` with Google sign-in for editing locale content directly on the server
- Locale JSON gated behind an access-code header (not publicly scrapable)
- Self-hostable on Coolify (Nixpacks build pack) with a persistent JSON volume

## Add This Guide to Your Phone

**We highly recommend installing this guide** — it's faster, easier, and works even offline.

### Android (Chrome) - Automatic Prompt ✨

On Android devices, Chrome will **automatically show an install banner** at the bottom of the screen after you visit the guide. Simply:

1. Wait for the **"Add to Home screen"** or **"Install"** banner to appear
2. Tap **"Install"** on the banner
3. The guidebook icon will appear on your home screen

**Manual installation (if banner doesn't appear):**

1. Tap the **three-dot menu** (⋮) in the top-right corner
2. Tap **"Add to Home screen"** or **"Install app"**
3. Confirm by tapping **"Add"** or **"Install"**

### iPhone (Safari) - Manual Installation

iOS requires manual installation via Safari:

1. Open the guidebook in **Safari** (not Chrome or other browsers)
2. Tap the **Share** button (square with arrow pointing up) at the bottom of the screen
3. Scroll down and tap **"Add to Home Screen"**
4. Customize the name if desired, then tap **"Add"**
5. The guidebook icon will appear on your home screen like a native app

**iOS Enhancements:**

- ✨ **Optimized status bar** - Translucent black status bar for immersive experience
- 📱 **Custom app title** - Shows "Neptune Guide" on home screen
- 🎨 **Splash screen support** - Smooth loading experience
- 🔗 **App shortcuts** - Quick access to Property Info and Local Guide (on supported iOS versions)

### Benefits of Installing

- 📲 **Quick access** from your home screen
- ⚡ **Faster loading** times
- 📴 **Works offline** after first visit
- 🎯 **Full-screen experience** without browser UI
- 🍎 **Native-like feel** on iOS with optimized meta tags

## Development

```bash
# Install dependencies
npm install

# Run guest app dev server (Vite)
npm run dev

# Run admin app dev server (Vite, on a different port)
npm run dev:admin

# Build everything for production (guest + admin)
npm run build

# Build individually
npm run build:guest
npm run build:admin

# Fetch locale data from Google Sheets into ./public/locales
npm run fetch-data
```

### Running the production server locally

The production server (`scripts/server.mjs`) serves both the guest app and
the admin app, gates `/locales/*`, and exposes the admin REST API. To run
it locally after a build:

```bash
npm run build

ACCESS_CODE=dev VITE_CODE=dev \
GOOGLE_OAUTH_CLIENT_ID=<your-client-id> \
ALLOWED_EMAILS=you@gmail.com \
SESSION_SECRET=$(openssl rand -hex 32) \
LOCALES_DIR=./public/locales \
LANGUAGES=en,es,fr,it \
node scripts/server.mjs

# Then visit:
#   http://localhost:3000          → guest app
#   http://localhost:3000/admin    → admin panel
```

## Environment Variables

See [`.env.local.example`](./.env.local.example) for an annotated template.

### Build time (Vite — baked into the bundles)

| Variable                      | Purpose                                                      |
| ----------------------------- | ------------------------------------------------------------ |
| `VITE_CODE`                   | Access code for the guest app                                |
| `VITE_APARTMENT_NUMBER`       | Unit/apartment number shown in UI                            |
| `VITE_LANGUAGES`              | Comma-separated language codes (drives i18n `supportedLngs`) |
| `VITE_GOOGLE_OAUTH_CLIENT_ID` | Google OAuth Web Client ID for admin sign-in                 |

### Runtime — guest server

| Variable      | Purpose                                                                                                                               |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `ACCESS_CODE` | Required. Server gates `/locales/*` requests against this header (`x-access-code`). Falls back to `VITE_CODE`.                        |
| `PORT`        | Port the server listens on (default `3000`)                                                                                           |
| `LOCALES_DIR` | Where the server reads/writes locale JSON. Default `dist/locales`. On Coolify set this to the volume mount, e.g. `/app/dist/locales`. |

### Runtime — admin auth

| Variable                 | Purpose                                                                                             |
| ------------------------ | --------------------------------------------------------------------------------------------------- |
| `GOOGLE_OAUTH_CLIENT_ID` | Same value as `VITE_GOOGLE_OAUTH_CLIENT_ID`. Used by the server to verify ID tokens.                |
| `ALLOWED_EMAILS`         | Comma-separated list of Google account emails allowed to sign into `/admin`                         |
| `SESSION_SECRET`         | Random secret (≥16 chars, generate with `openssl rand -hex 32`). Used to HMAC-sign session cookies. |

### Runtime — Google Sheets fetch

| Variable                      | Purpose                                                                                  |
| ----------------------------- | ---------------------------------------------------------------------------------------- |
| `GOOGLE_SHEET_ID`             | Source spreadsheet ID                                                                    |
| `GOOGLE_SERVICE_ACCOUNT_KEY`  | Service account JSON (single-line). Recommended for CI/Coolify.                          |
| `GOOGLE_SERVICE_ACCOUNT_PATH` | Path to a service account JSON file. Recommended for local dev.                          |
| `LANGUAGES`                   | Comma-separated language codes the fetch script reads                                    |
| `FORCE_FETCH_LOCALES=1`       | If set, `start.sh` re-pulls from Sheets on next boot even if the volume already has data |

## Admin panel

The admin panel lives at `/admin` and lets allowlisted Google accounts edit
the locale JSON files directly on the server, without a redeploy.

### Setting up Google OAuth

1. Go to the [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials).
2. **Create Credentials → OAuth client ID → Web application**.
3. Under **Authorized JavaScript origins**, add your URLs:
   - `http://localhost:3000` (for local production server testing)
   - `http://localhost:5174` (for `npm run dev:admin`)
   - Your Coolify URL, e.g. `https://your-app.example.com`
4. Copy the **Client ID**.
5. Set `VITE_GOOGLE_OAUTH_CLIENT_ID` (build) and `GOOGLE_OAUTH_CLIENT_ID`
   (runtime) to that client ID. They must be identical.

### Admin REST API

All endpoints live under `/api/*` and require an HMAC-signed session
cookie (set after a successful Google sign-in).

| Method | Path                 | Purpose                                                                |
| ------ | -------------------- | ---------------------------------------------------------------------- |
| `POST` | `/api/auth/google`   | Verify Google ID token → set session cookie                            |
| `POST` | `/api/auth/logout`   | Clear session cookie                                                   |
| `GET`  | `/api/auth/me`       | Current user (or 401)                                                  |
| `GET`  | `/api/locales`       | List languages with mtime                                              |
| `GET`  | `/api/locales/:lang` | Read a locale JSON file                                                |
| `PUT`  | `/api/locales/:lang` | Atomically write a locale JSON file                                    |
| `POST` | `/api/sheets/pull`   | Re-fetch all languages from Google Sheets and overwrite the JSON files |

Session cookies are `HttpOnly`, `SameSite=Lax`, `Secure` (in production),
and expire after 7 days.

## Deploying to Coolify (Nixpacks)

Locale JSON files are **not bundled** — they are loaded at runtime from
`/locales/{lng}.json`. On Coolify those files live on a persistent volume so
they survive rebuilds. The admin panel writes to the same volume.

### Setup

1. **Create the application** in Coolify, point it at this repo, and select
   **Application → Nixpacks** as the build pack. The included `nixpacks.toml`
   configures build/start commands automatically.
   (Do NOT use Coolify's "Static Site" resource type — it serves with Caddy
   and ignores `scripts/start.sh`.)
2. **Set environment variables** (see the tables above and `.env.local.example`).
   In Coolify, mark `VITE_*` and `NIXPACKS_NODE_VERSION` as **Build Time**.
3. **Add a persistent volume** mounted at:

   ```
   /app/dist/locales
   ```

   This is where the locale JSON files are read from at runtime, and where
   the admin panel saves edits.

4. **Expose port** `3000` (or override with the `PORT` env var).

### How the data lifecycle works

- **First boot:** `scripts/start.sh` sees the volume is empty, runs
  `node scripts/fetch-sheet-data.mjs` which writes the locale JSON files
  directly into `/app/dist/locales` (the volume), then starts the server.
- **Subsequent boots / rebuilds:** the volume already has data, so the
  entrypoint skips the fetch and just starts the server. Your edits /
  fetched data persist.
- **Updating content** — three options:
  1. **Admin panel** (recommended): visit `/admin`, sign in with an
     allowlisted Google account, edit, save. Changes take effect immediately.
  2. **Refresh from Google Sheets**: click "Pull from Google Sheets" in the
     admin panel, or open a Coolify terminal and run
     `LOCALES_DIR=/app/dist/locales npm run fetch-data`, or restart the
     container with `FORCE_FETCH_LOCALES=1`.
  3. **Edit JSON directly on the volume** via the Coolify terminal.

## Internationalization (i18n)

### Language Support

The app supports multiple languages using `react-i18next` with `i18next-http-backend`. Translation files are loaded at runtime from `public/locales/` (dev) or `dist/locales/` (production / Coolify volume). Generated files:

- `en.json` - English (default)
- `es.json` - Spanish
- `fr.json` - French
- `it.json` - Italian

### Language Selector

The language selector is a dropdown component fixed in the top-right corner of the banner:

- **Component**: `src/components/LanguageSelector.tsx`
- **Styles**: `src/components/LanguageSelector.css`
- **Features**:
  - Displays current language flag and code
  - Dropdown menu with all available languages
  - Persists language selection across sessions
  - Responsive design (hides language code on mobile)

### Important i18n Rules

**⚠️ CRITICAL: Navigation Links in Translations**

When working with feature links in the Welcome section:

1. **Links are language-agnostic**: The `link` property in features should ONLY contain section IDs, never translated text
2. **Valid section IDs**: `property-info`, `check-in-out`, `local-guide`, `transport`, `amenities`, `emergency`
3. **English-only links**: The `fetch-sheet-data.js` script automatically excludes `link` properties from non-English translations
4. **Manual editing**: If manually editing translation files, ensure links use section IDs, not translated text

**Example (Correct)**:

```json
{
  "text": "Código Wi-Fi",
  "link": "property-info" // ✅ Section ID, not translated
}
```

**Example (Incorrect)**:

```json
{
  "text": "Código Wi-Fi",
  "link": "información de la propiedad" // ❌ Translated text
}
```

### Google Sheets Integration

The `scripts/fetch-sheet-data.mjs` script fetches content from Google Sheets and generates translation files:

**How it works**:

1. Reads data from separate sheets for each language (e.g., `en`, `es`, `fr`, `it`)
2. Transforms key-value pairs into the guidebook JSON structure
3. **Automatically excludes `link` properties for non-English languages**
4. Writes to `${LOCALES_DIR}/{lang}.json` (defaults to `public/locales` in dev, `dist/locales` in production)

**Running the script**:

```bash
npm run fetch-data
```

**Sheet Structure**:

- Each language has its own sheet tab
- Column A: Key (e.g., `welcome_feature_1_text`)
- Column B: Value (translated content)
- Links are only fetched from the English sheet

## Documentation

Comprehensive documentation is available in the `docs/` folder:

- **[Internationalization Guide](docs/internationalization.md)** - Complete guide to i18n, translation management, and navigation links
- **[Component Guidelines](docs/component-guidelines.md)** - Component development standards, styling conventions, and best practices
- **[Google Sheets Integration](docs/google-sheets-integration.md)** - Setup, configuration, and usage of the Google Sheets CMS
- **[Icon Utilities Guide](docs/icon-utilities.md)** - Complete reference for Material Symbols icon utility classes
- **[Icon Quick Reference](docs/icon-quick-reference.md)** - Cheat sheet with copy-paste ready icon examples
- **[Icon Inventory](docs/icon-inventory.md)** - Catalog of all icons used in the application

## Tech Stack

- React 19 + TypeScript (guest app and admin app)
- Vite 8 with Rolldown (two separate Vite configs: `vite.config.ts`, `vite.admin.config.ts`)
- i18next / react-i18next + i18next-http-backend (runtime locale loading with custom auth header)
- Google Sheets API (`googleapis`) for content sync
- Google Identity Services + `google-auth-library` for admin sign-in
- React Hook Form + Zod for admin forms
- Custom Node `http` server (`scripts/server.mjs`) — no Express, no `serve`
- Coolify + Nixpacks for hosting

## Project Structure

```
types/                     # Shared TypeScript types (used by both apps)
├── types.ts               # Domain types (GuidebookData, Welcome, ...)
└── vite-env.d.ts          # Ambient typing for import.meta.env.VITE_*

src/
├── app/                   # Guest app (the guidebook)
│   ├── components/
│   │   ├── LanguageSelector.tsx
│   │   ├── Navigation.tsx
│   │   └── ...
│   ├── i18n/config.ts     # i18next config (sends x-access-code header)
│   ├── App.tsx            # Root component
│   ├── main.tsx           # Entry point
│   └── index.html         # Vite HTML entry
└── admin/                 # Admin panel SPA (built separately)
    ├── App.tsx            # Auth gate
    ├── SignIn.tsx         # Google Identity Services sign-in
    ├── Editor.tsx         # Language picker + JSON editor + actions
    ├── api.ts             # Typed REST client for /api/*
    ├── main.tsx           # Entry point
    ├── index.html         # Vite HTML entry
    └── styles.css

scripts/                   # Node-only code
├── server.mjs             # Production HTTP server (guest + admin + API)
├── start.sh               # Container entrypoint
├── fetch-sheet-data.mjs   # CLI wrapper: pulls Sheets → JSON
└── lib/
    ├── auth.mjs           # Sessions, cookies, Google ID token verification
    ├── locales.mjs        # Read/write locale JSON files
    └── sheets.mjs         # Google Sheets pull + transform logic

public/                    # Static assets shared with the guest app
├── favicon.svg
├── manifest.json
├── sw.js
└── locales/               # Dev locale JSON (committed)

dist/                      # Built guest app (production)
└── admin/                 # Built admin app (production)
```

**Vite configs:**

- `vite.config.ts` — `root: "src/app"` → output `dist/`
- `vite.admin.config.ts` — `root: "src/admin"` → output `dist/admin/`

**Path alias:**

`@/*` resolves to the project root, so both apps can share the `types/` folder cleanly:

```ts
import type { GuidebookData } from "@/types/types";
```

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
