---
description: Add a new language to the guidebook
---

# Adding a New Language

## Steps

1. **Create a new sheet tab in Google Sheets** with the language code (e.g., `de` for German)

2. **Set environment variables**:
   - Update `VITE_LANGUAGES` (build) to include new language: `en,es,fr,it,de`
   - Update `LANGUAGES` (runtime) to include new language: `en,es,fr,it,de`

3. **Add language to LanguageSelector component**:
   - Open `src/app/components/LanguageSelector.tsx`
   - Add to the `languages` array:
     ```typescript
     const languages = [
       { code: "en", name: "English", flag: "🇬🇧" },
       { code: "es", name: "Español", flag: "🇪🇸" },
       { code: "fr", name: "Français", flag: "🇫🇷" },
       { code: "it", name: "Italiano", flag: "🇮🇹" },
       { code: "de", name: "Deutsch", flag: "🇩🇪" },
     ];
     ```

4. **Generate translation file**:
   - Run `npm run fetch-data` locally
   - OR click "Pull from Google Sheets" in `/admin` panel
   - This will generate `public/locales/{lang}.json` (dev) or `/app/dist/locales/{lang}.json` (production)

5. **Verify**:
   - Check that the new language appears in the language selector dropdown
   - Test that translations load correctly
   - Verify navigation links work (should use section IDs, not translated text)

## Important Notes

- **CRITICAL**: Never translate section IDs in the `link` property
- The `fetch-sheet-data.mjs` script automatically excludes `link` properties from non-English translations
- Ensure all keys in the new sheet tab match the English sheet exactly
