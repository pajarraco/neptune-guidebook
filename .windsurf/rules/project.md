# Neptune Guidebook - Project Rules

## Project Structure

This is a multi-app React project with two separate Vite builds:

- **Guest app** (`src/app/`) - The guidebook for vacation rental guests
- **Admin panel** (`src/admin/`) - Content editor with Google sign-in
- **Shared types** (`types/`) - TypeScript types used by both apps
- **Server** (`src/server/`) - Node.js production server with Sheets sync
- **Scripts** (`scripts/`) - Utility scripts

### Path Alias

Use `@/` to import from project root (especially for shared types):

```ts
import type { GuideSection } from "@/types/types";
```

## Component Guidelines

### Guest App Components

- Place in `src/app/components/`
- Use descriptive Props interface names (e.g., `LanguageSelectorProps`)
- Use `material-symbols-outlined` class for Material Icons (not `material-icons`)
- Use icon utility classes from `styles.css` instead of inline styles
- Use `useTranslation()` from `react-i18next` for translations
- Translation keys use dot notation (e.g., `t('welcome.featuresSection.title')`)
- Arrays use `returnObjects: true` with type assertions

### Admin Panel Components

- Place directly in `src/admin/` or create subfolders
- Modular structure: Editor, TopBanner, SidebarMenu, SidebarFooter, ContentForm
- Section forms in `src/admin/components/sections/`
- Form primitives in `src/admin/components/forms/primitives.tsx`
- **English-only** - no `useTranslation()` in admin
- Use `src/admin/api.ts` for all backend calls (never call `fetch()` directly)

## Critical Rules

### Navigation Links (CRITICAL)

**NEVER translate section IDs** in the `link` property of features.

Valid section IDs: `property-info`, `check-in-out`, `local-guide`, `transport`, `amenities`, `emergency`

The `fetch-sheet-data.mjs` script automatically excludes `link` properties from non-English translations.

### Icons

- Always use `material-symbols-outlined` class (not `material-icons`)
- Use utility classes from `styles.css` for sizing, color, spacing
- See `docs/icons.md` for complete reference

### CSS

- Use section headers with format `/* ============================================ */` for major sections
- Use CSS custom properties defined in root
- Class naming: kebab-case (e.g., `language-selector-toggle`)

## Admin Panel Architecture

### Authentication

- Google Identity Services for sign-in
- HMAC-signed session cookies (HttpOnly, SameSite=Lax, 7-day TTL)
- Email allowlist via `ALLOWED_EMAILS` env var
- Session cookie name: `admin_session`

### API Endpoints

All `/api/*` endpoints require session authentication except:

- `/api/auth/google` - Open (sets session)
- `/api/auth/logout` - Open (clears session)
- `/api/auth/me` - Open (reads session)

### File Writes

- Use `writeLanguage()` for atomic writes (temp file + rename)
- Never write JSON files directly from frontend
- Always go through `PUT /api/locales/:lang`

## Environment Variables

### Build Time (Vite)

- `VITE_CODE` - Guest app access code
- `VITE_APARTMENT_NUMBER` - Unit number shown in UI
- `VITE_LANGUAGES` - Comma-separated language codes
- `VITE_GOOGLE_OAUTH_CLIENT_ID` - Google OAuth client ID

### Runtime

- `ACCESS_CODE` - Gates `/locales/*` (must equal `VITE_CODE`)
- `GOOGLE_OAUTH_CLIENT_ID` - Same as build-time, for server verification
- `ALLOWED_EMAILS` - Comma-separated allowlist for admin
- `SESSION_SECRET` - HMAC key (≥16 chars, use `openssl rand -hex 32`)
- `GOOGLE_SHEET_ID` - Spreadsheet ID for Sheets fetch
- `GOOGLE_SERVICE_ACCOUNT_KEY` or `GOOGLE_SERVICE_ACCOUNT_PATH` - Service account credentials
- `LANGUAGES` - Comma-separated language codes for fetch script
- `LOCALES_DIR` - Where locale JSON is read/written (default `dist/locales`)

**IMPORTANT:** `VITE_GOOGLE_OAUTH_CLIENT_ID` and `GOOGLE_OAUTH_CLIENT_ID` MUST be identical.

## Google Sheets Integration

### Sheet Structure

- One tab per language (e.g., `en`, `es`, `fr`, `it`)
- Column A: Key (technical identifier)
- Column B: Value (translated content)

### Key Naming

- Simple: `property_name`, `welcome_features_title`
- Numbered arrays: `welcome_feature_1_text`, `welcome_feature_1_icon`, `welcome_feature_1_link`
- Nested objects: `property_wifi_network`, `emergency_alert_title`

### Special Formatting

- Use `\n` for line breaks in sheet content
- HTML tags allowed for formatting (e.g., `<strong>`, `<br>`)

### Fetch Script

Run `npm run fetch-data` to pull from Sheets.
Output goes to `LOCALES_DIR` (default `dist/locales`, set to `./public/locales` for dev).

## Server Architecture

### Request Gating

| Path prefix                                            | Gate                                             |
| ------------------------------------------------------ | ------------------------------------------------ |
| `/api/auth/google`, `/api/auth/logout`, `/api/auth/me` | Open                                             |
| `/api/*` (everything else)                             | Requires session cookie                          |
| `/locales/*`                                           | Requires `x-access-code` header == `ACCESS_CODE` |
| `/settings/*`                                          | Requires `x-access-code` header == `ACCESS_CODE` |
| `/admin/*`                                             | Open static files                                |
| Everything else                                        | Open static files                                |

### Server Modules

- `server.mjs` - HTTP routing + middleware + static file serving
- `lib/auth.mjs` - Session signing, Google ID token verification, email allowlist
- `lib/locales.mjs` - `listLanguages`, `readLanguage`, `writeLanguage` (atomic)
- `lib/settings.mjs` - `listSettings`, `readSetting`, `writeSetting` (atomic)
- `lib/sheets.mjs` - `pullSheetsToLocales`, `transformToGuidebookFormat`

## Documentation

See `docs/` folder for comprehensive documentation:

- `docs/guidelines.md` - Development guidelines, admin panel, components
- `docs/internationalization.md` - i18n rules, navigation links
- `docs/google-sheets-integration.md` - Sheets setup and configuration
- `docs/icons.md` - Material Symbols icon utilities

## Build Commands

- `npm run dev` - Guest app dev server
- `npm run dev:admin` - Admin app dev server
- `npm run build` - Build both apps
- `npm run build:guest` - Build guest app only
- `npm run build:admin` - Build admin app only
- `npm run fetch-data` - Pull from Google Sheets

## Vite Configs

- `vite.config.ts` - Guest app (`root: "src/app"` → `dist/`)
- `vite.admin.config.ts` - Admin app (`root: "src/admin"` → `dist/admin/`)
