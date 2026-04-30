# Internationalization Rules

## Overview

The guest app (`src/app/`) uses `react-i18next` with `i18next-http-backend`
to load translation files at runtime from `/locales/{lng}.json`. The
admin panel (`src/admin/`) is intentionally **not** internationalized.

Locale JSON files are managed two ways:

1. **Google Sheets** → fetched via `src/server/fetch-sheet-data.mjs`
2. **Admin panel** at `/admin` → form-based editor that writes to the
   same JSON files (PUT `/api/locales/:lang`)

In production both write to the persistent volume mounted at
`/app/dist/locales`. The guest app fetches them with an `x-access-code`
header (gated by the `ACCESS_CODE` env var on the server).

## Settings and Configuration

Static configuration files (e.g., icon lists, feature flags) are stored in
`public/settings/{name}.json` and served at `/settings/{name}.json` using the
same access code gating pattern as locales.

### Settings API Pattern

- **Server endpoint**: `/settings/{name}.json` (gated by `ACCESS_CODE`)
- **Guest app client**: `src/app/api.ts` provides a centralized wrapper
- **Admin panel**: Can manage settings via `/api/settings/*` endpoints
  (requires session authentication)

### Adding a New Setting

1. Create the JSON file in `public/settings/{name}.json`
2. Add a read method to `src/app/api.ts` if the guest app needs it
3. Add admin endpoints to `src/admin/api.ts` if the admin needs to edit it
4. The server already serves `/settings/*` with access code gating

Example:

```typescript
// src/app/api.ts
export const api = {
  readConfig: () =>
    request<{ amenityIcons?: string[] }>("/settings/config.json"),
};
```

## Critical Rules

### 1. Navigation Links Must Be Language-Agnostic

**NEVER** translate section IDs in the `link` property of features.

**Valid Section IDs:**

- `property-info`
- `check-in-out`
- `local-guide`
- `transport`
- `amenities`
- `emergency`

**Correct Example:**

```json
{
  "features": [
    {
      "text": "Código Wi-Fi",
      "link": "property-info"
    }
  ]
}
```

**Incorrect Example:**

```json
{
  "features": [
    {
      "text": "Código Wi-Fi",
      "link": "información de la propiedad"
    }
  ]
}
```

### 2. Link Properties Are English-Only

The transform logic in `src/server/lib/sheets.mjs` automatically:

- Includes `link` properties ONLY in `en.json`
- Excludes `link` properties from `es.json`, `fr.json`, `it.json`

This is controlled in the `transformToGuidebookFormat` function:

```javascript
const featureProperties =
  language === "en" ? ["icon", "text", "link"] : ["icon", "text"];
```

### 3. Manual Translation File Editing

When manually editing translation files:

1. **Never add `link` properties to non-English files** - they will be ignored by the component
2. **Only translate user-facing text** - keep all technical identifiers (section IDs, keys) unchanged
3. **Maintain JSON structure** - ensure all objects and arrays match the English version structure

### 4. Adding New Languages

To add a new language:

1. Create a new sheet tab in Google Sheets with the language code (e.g., `de` for German)
2. Set `VITE_LANGUAGES=en,es,fr,it,de` (build) and `LANGUAGES=en,es,fr,it,de` (runtime)
3. Add the language to `src/app/components/LanguageSelector.tsx`:
   ```typescript
   const languages = [
     { code: "en", name: "English", flag: "🇬🇧" },
     { code: "es", name: "Español", flag: "🇪🇸" },
     { code: "fr", name: "Français", flag: "🇫🇷" },
     { code: "it", name: "Italiano", flag: "🇮🇹" },
     { code: "de", name: "Deutsch", flag: "🇩🇪" },
   ];
   ```
4. Run `npm run fetch-data` (or click "Pull from Google Sheets" in the
   admin panel) to generate the new translation file

## Language Selector Component

### Location

- **Component**: `src/app/components/LanguageSelector.tsx`
- **Styles**: `src/app/components/LanguageSelector.css`
- **Position**: Fixed in top-right corner of the banner

### Features

- Dropdown menu showing current language flag and code
- Click to expand and select from available languages
- Auto-closes after selection
- Responsive (hides language code on mobile devices)
- Uses Material Symbols Outlined icons

### Styling Rules

- Fixed position: `top: 20px; right: 20px;`
- High z-index (1000) to stay above other content
- White background with shadow for visibility
- Rounded corners (25px for toggle, 12px for dropdown)

## Content management (two paths)

### Path A — Google Sheets fetch

CLI: `src/server/fetch-sheet-data.mjs` (thin wrapper around
`src/server/lib/sheets.mjs`).

```bash
npm run fetch-data
```

In production this can be triggered without shelling in by clicking
"Pull from Google Sheets" in `/admin` (POST `/api/sheets/pull`).

### Path B — Admin panel edits

Sign-in at `/admin` (Google account in `ALLOWED_EMAILS`), edit a
language's JSON, click Save. Server writes to the volume atomically
(temp file + rename). Changes take effect on next page load — no
rebuild required.

## Google Sheets Data Fetching

### Script Location

`src/server/fetch-sheet-data.mjs` — imports from `src/server/lib/sheets.mjs`

### Key Functions

**`transformToGuidebookFormat(config, language)`**

- Transforms Google Sheets data into the guidebook JSON structure
- `language` parameter determines whether to include `link` properties
- Only includes links when `language === 'en'`

**`getNumberedItems(config, prefix, properties)`**

- Fetches numbered items from the sheet (e.g., `welcome_feature_1_text`, `welcome_feature_2_text`)
- `properties` array determines which fields to include
- For features, properties vary by language (see Rule #2)

### Running the Script

```bash
npm run fetch-data
```

### Environment Variables Required

- `GOOGLE_SHEET_ID` - The Google Sheets document ID
- `GOOGLE_SERVICE_ACCOUNT_KEY` or `GOOGLE_SERVICE_ACCOUNT_PATH` - Authentication credentials
- `LANGUAGES` - Comma-separated language codes (e.g., "en,es,fr,it")

## Common Issues and Solutions

### Issue: Links don't work in translated versions

**Cause**: Link properties contain translated text instead of section IDs  
**Solution**:

1. Check translation files - remove or fix incorrect `link` values
2. Re-run `npm run fetch-data` to regenerate from Google Sheets
3. Ensure Google Sheets only has section IDs in link columns

### Issue: Language selector icon not displaying

**Cause**: Wrong Material Icons class name  
**Solution**: Use `material-symbols-outlined` not `material-icons`

### Issue: New language not appearing

**Cause**: Missing from LanguageSelector component or env vars  
**Solution**:

1. Add to `languages` array in `src/app/components/LanguageSelector.tsx`
2. Add to `VITE_LANGUAGES` (build) and `LANGUAGES` (runtime) env vars
3. Run `npm run fetch-data` or click "Pull from Google Sheets" in `/admin`

### Issue: Locales return 401 in browser console

**Cause**: `i18next-http-backend` is fetching `/locales/*.json` without
the `x-access-code` header, or the server's `ACCESS_CODE` env var is
unset / different from `VITE_CODE`.  
**Solution**: confirm `ACCESS_CODE === VITE_CODE` in Coolify env vars,
and that `src/app/i18n/config.ts` still includes the `customHeaders`
block.

### Issue: Locales return HTML (SPA fallback)

**Cause**: The Coolify resource is configured as "Static Site" (Caddy)
and ignores `src/server/start.sh`, so the volume is empty.  
**Solution**: recreate as **Application → Nixpacks** with a persistent
volume mounted at `/app/dist/locales`.

## Best Practices

1. **Always use the fetch script** - Don't manually create translation files
2. **Test all languages** - After changes, verify links work in all languages
3. **Keep structure consistent** - All translation files should have the same JSON structure
4. **Use section IDs** - Never translate technical identifiers
5. **Validate JSON** - Ensure all translation files are valid JSON
