# Development Guidelines

## Project Layout

The codebase has two separate React apps that share `types/` and `public/`:

- `src/app/` — the guest guidebook (built into `dist/`)
- `src/admin/` — the admin panel (built into `dist/admin/`)
- `types/` — shared TypeScript types and Vite ambient declarations
- `src/server/` — Node-only code (production server, Sheets sync, helpers)
- `scripts/` — legacy utility scripts (json-to-csv.js)

When creating components for the guest app, place them in `src/app/components/`. Admin components live directly in `src/admin/` (or create subfolders as the panel grows).

Use the `@/` path alias to import from the project root — most commonly for shared types:

```ts
import type { GuideSection } from "@/types/types";
```

## Admin Panel

### Overview

The admin panel at `/admin` lets allowlisted Google accounts edit locale JSON files directly on the server, without redeploys. It's a separate Vite build at `src/admin/` served from `dist/admin/`.

### Architecture

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
  │  GET  /api/settings           list settings
  │  GET  /api/settings/:setting  read setting JSON
  │  PUT  /api/settings/:setting  write setting JSON (atomic)
  │  POST /api/sheets/pull        run pullSheetsToLocales()
  ▼
Volume: /app/dist/locales, /app/dist/settings
```

### Server (`src/server/server.mjs` + `src/server/lib/`)

- `lib/auth.mjs` — session signing, Google ID token verification, email allowlist
- `lib/locales.mjs` — `listLanguages`, `readLanguage`, `writeLanguage` (atomic via temp-file rename)
- `lib/settings.mjs` — `listSettings`, `readSetting`, `writeSetting` (atomic via temp-file rename)
- `lib/sheets.mjs` — `pullSheetsToLocales`, `transformToGuidebookFormat`
- `server.mjs` — HTTP routing + middleware + static file serving

### Request Gating

| Path prefix                                            | Gate                                                   |
| ------------------------------------------------------ | ------------------------------------------------------ |
| `/api/auth/google`, `/api/auth/logout`, `/api/auth/me` | Open (set/clear/read session)                          |
| `/api/*` (everything else)                             | Requires valid session cookie                          |
| `/locales/*`                                           | Requires `x-access-code` header == `ACCESS_CODE`       |
| `/settings/*`                                          | Requires `x-access-code` header == `ACCESS_CODE`       |
| `/admin/*`                                             | Open static files (the SPA itself doesn't reveal data) |
| Everything else                                        | Open static files (the guest SPA)                      |

### Session Cookies

- Name: `admin_session`
- Format: `<base64url(payload)>.<base64url(hmac)>` where `payload = { email, exp }`
- Algorithm: HMAC-SHA256 with `SESSION_SECRET`
- Flags: `HttpOnly`, `SameSite=Lax`, `Secure` (in production), 7-day TTL

### Required Environment Variables

| Var                           | Type    | Why                                              |
| ----------------------------- | ------- | ------------------------------------------------ |
| `VITE_GOOGLE_OAUTH_CLIENT_ID` | Build   | Loaded by Google Identity Services in the bundle |
| `GOOGLE_OAUTH_CLIENT_ID`      | Runtime | Server verifies ID token audience                |
| `ALLOWED_EMAILS`              | Runtime | Comma-separated allowlist                        |
| `SESSION_SECRET`              | Runtime | HMAC key (≥16 chars; use `openssl rand -hex 32`) |
| `ACCESS_CODE`                 | Runtime | Gates `/locales/*` (must equal `VITE_CODE`)      |

`VITE_GOOGLE_OAUTH_CLIENT_ID` and `GOOGLE_OAUTH_CLIENT_ID` MUST be the same value. The first is for the browser, the second for the server's verification.

### Adding a New Admin Endpoint

1. Add a handler in `src/server/server.mjs` under `handleApi()`.
2. If it mutates state, require the session (already done by default for everything except the auth/\* routes).
3. Add a method to `src/admin/api.ts` so components don't call `fetch()` directly.
4. Validate inputs server-side; never trust the body.
5. For file writes, use `writeLanguage()` (atomic) — never partial writes.

### Admin Component Architecture

The admin panel is split into focused components for better maintainability:

**Main Editor** (`src/admin/components/Editor.tsx`)

- Manages state (languages, active section, form dirty flag, status)
- Handles data fetching (loadLocale, loadLanguages)
- Handles save/revert/pull/push operations
- Coordinates between sub-components

**Sub-components** (`src/admin/components/editor/`)

- **TopBanner** — Header with title, email display, and sign-out button
- **SidebarMenu** — Navigation menu for sections and settings
- **SidebarFooter** — Language selector and Google Sheets integration buttons
- **ContentForm** — Main content area with toolbar, status bar, and form rendering

**Section Forms** (`src/admin/components/sections/`)
Each guidebook section has its own form component:

- WelcomeForm, PropertyInfoForm, CheckInOutForm, TransportForm
- HouseRulesForm, AmenitiesForm, LocalGuideForm, EmergencyForm, MiscForm

**Settings Form** (`src/admin/components/settings/`)

- SettingsForm — Edits configuration files (e.g., amenityIcons)

**Form Primitives** (`src/admin/components/forms/primitives.tsx`)
Reusable form components bound to react-hook-form:

- `Section` — Collapsible section container
- `TextField` — Text input with label and hint
- `Textarea` — Multi-line text input
- `StringArrayField` — Array of strings with add/remove
- `ObjectArrayField` — Array of objects with typed sub-fields
- `Row` — Helper for side-by-side field layout

**Router** (`src/admin/components/Router.tsx`)

- Section and settings registries

### Type Organization

- `types/admin.ts` — Admin-specific types (Status, LocaleData, EditorProps, SectionDef, SettingsDef)
- `types/forms.ts` — Form primitive types (SectionProps, FieldProps, TextareaProps, StringArrayProps, ObjectArrayProps)
- `types/types.ts` — Guidebook data structure types

### Admin Conventions

- **Single source of truth for content**: locale JSON files served from `/locales/{lng}.json` and persisted on a Coolify volume.
- **REST API client**: `src/admin/api.ts` wraps `fetch()` with cookie credentials and centralized error handling. Always go through it — do not call `fetch()` directly from components.
- **Auth boundary**: `src/admin/App.tsx` gates rendering of `Editor` on a successful `api.authMe()` call. Components rendered inside `Editor` may assume the user is authenticated.
- **No i18n**: the admin panel is intentionally English-only — it edits translations rather than displaying them.
- **Plain CSS**: `src/admin/styles.css` defines variables (`--bg`, `--surface`, `--primary`, etc.). Reuse them; don't inline colors.
- **Component modularity**: Split large components into focused sub-components for maintainability.

### Admin DO

- Use `api.ts` for every backend call.
- Treat `types/types.ts` as the canonical schema. If you change a guidebook field, update both this file and the corresponding section editor.
- Show success/error feedback for every mutating action.
- Confirm destructive actions (Pull from Sheets, etc.).
- Keep the admin English-only — no `useTranslation()` in `src/admin/`.

### Admin DON'T

- Don't put credentials in the bundle. The OAuth client ID is fine; the OAuth client secret, service account JSON, and `SESSION_SECRET` must stay server-side only.
- Don't write to JSON files directly from the frontend. Always go through `PUT /api/locales/:lang`.
- Don't bypass the session check by adding routes outside `handleApi()`.
- Don't cache `/api/*` or `/locales/*` in the service worker (`public/sw.js` already excludes them).

## Guest App API

The guest app (`src/app/`) uses a centralized API wrapper similar to the admin panel:

- **REST API client**: `src/app/api.ts` wraps `fetch()` with access code authentication and centralized error handling. Always go through it — do not call `fetch()` directly from components.
- **Access code authentication**: API calls automatically include the `VITE_CODE` as a query parameter for gated endpoints.
- **Config files**: Static configuration (e.g., icon lists) should be stored in `public/settings/{name}.json` and fetched via the API at runtime, not imported at build time.

Example usage:

```typescript
import { api } from "../api";

const config = await api.readConfig();
```

## Component Development

### TypeScript Types

- Define proper interfaces for props
- Use descriptive Props interface names (e.g., TopBannerProps, SidebarMenuProps)
- Use type assertions for i18n array returns
- Optional properties should use `?` notation

### Internationalization

- **Import**: `import { useTranslation } from 'react-i18next';`
- **Usage**: `const { t, i18n } = useTranslation();`
- **Translation keys**: Use dot notation (e.g., `t('welcome.featuresSection.title')`)
- **Arrays**: Use `returnObjects: true` for array translations

Example:

```typescript
const features = t("welcome.featuresSection.features", {
  returnObjects: true,
}) as Array<{ text: string; link?: string }>;
```

### Material Icons

- **Class name**: `material-symbols-outlined` (not `material-icons`)
- **Styling**: Use utility classes from `styles.css` instead of inline styles
- **Common icons**: `expand_more`, `expand_less`, `location_on`, `wifi`, `phone`, `emergency`, `info`
- **Documentation**: [Icons Guide](./icons.md) - Complete icon documentation

### Responsive Design

- Mobile-first approach
- Use media queries for breakpoints:
  - `@media (max-width: 768px)` - Tablet/mobile
  - `@media (max-width: 480px)` - Small mobile

### Styling Conventions

- Use CSS modules or separate CSS files
- Class naming: kebab-case (e.g., `language-selector-toggle`)
- Consistent spacing: 8px base unit
- Colors: Use existing theme colors
- Shadows: Subtle for depth (e.g., `0 2px 8px rgba(0, 0, 0, 0.1)`)
- CSS organization: Use section headers with format `/* ============================================ */` for major sections

### Accessibility

#### ARIA Labels

Always include aria-label for icon-only buttons:

```tsx
<button aria-label="Select language">
  <span className="flag">{currentLanguage.flag}</span>
</button>
```

#### Keyboard Navigation

- Ensure all interactive elements are keyboard accessible
- Use semantic HTML (button, nav, etc.)
- Maintain logical tab order

#### Screen Readers

- Use semantic HTML elements
- Provide text alternatives for icons
- Ensure state changes are announced

### Performance

#### State Updates

- Minimize unnecessary re-renders
- Use callback functions for state updates when needed
- Close dropdowns/modals after actions complete

#### Event Handlers

- Use arrow functions in JSX sparingly
- Define handlers outside render when possible
- Clean up event listeners in useEffect cleanup

#### Code Splitting

- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Lazy load heavy components when appropriate

## Specific Components

### Language Selector Component

#### Purpose

Provides a dropdown menu for users to switch between available languages.

#### Location & Positioning

- **File**: `src/app/components/LanguageSelector.tsx`
- **Styles**: `src/app/components/LanguageSelector.css`
- **Position**: Fixed in top-right corner of the banner
- **Z-index**: 1000 (stays above all content)

#### Implementation Details

**State Management:**

```typescript
const [isOpen, setIsOpen] = useState(false);
```

- Tracks dropdown open/closed state
- Closes automatically after language selection

**Current Language Detection:**

```typescript
const currentLanguage =
  languages.find((lang) => lang.code === i18n.language) || languages[0];
```

- Finds current language from i18n
- Falls back to first language (English) if not found

**Language Change Handler:**

```typescript
const changeLanguage = (langCode: string) => {
  i18n.changeLanguage(langCode);
  setIsOpen(false);
};
```

- Changes language via i18next
- Closes dropdown after selection

#### Styling Requirements

**Toggle Button:**

- Display: flex with 8px gap
- Background: white
- Padding: 8px 16px
- Border-radius: 25px
- Box-shadow for depth
- Hover effect: increased shadow

**Dropdown Menu:**

- Position: absolute, below toggle button
- Background: white
- Border-radius: 12px
- Min-width: 160px
- Box-shadow for depth

**Responsive Behavior:**

- Mobile (≤768px): Hide language code, show only flag
- Small screens (≤480px): Reduce sizes

### Navigation Component

#### Link Handling

When implementing navigation links:

1. **Use section IDs** - Never use translated text for navigation
2. **Valid section IDs**: `property-info`, `check-in-out`, `local-guide`, `transport`, `amenities`, `emergency`
3. **onClick handler**: Should call `onNavigate(sectionId)` or similar navigation function

Example:

```tsx
<li
  className={feature.link ? "clickable" : ""}
  onClick={() => feature.link && onNavigate(feature.link)}
>
  {feature.text}
</li>
```

## Related Documentation

- [Icons Guide](./icons.md) - Material Symbols icon utilities and inventory
- [Google Sheets Integration](./google-sheets-integration.md) - Sheets fetch and sync
- [Internationalization Rules](./internationalization.md) - i18n and translation management
