# Multi-Language Setup Guide

This guide explains how to set up and use multiple languages in the Neptune Guidebook.

## Overview

The application uses i18next for internationalization. Translation data is stored in Google Sheets and fetched into JSON files for each language.

## Setup

### 1. Google Sheets Structure

Create separate sheets in your Google Spreadsheet for each language:
- `en` - English translations
- `es` - Spanish translations
- `fr` - French translations
- etc.

Each sheet should have the same structure:
- Column A: Translation key (e.g., `welcome_intro_message_1`)
- Column B: Translation value

### 2. Environment Variables

Add the `LANGUAGES` variable to your `.env.local` file:

```bash
# Languages to fetch (comma-separated sheet names)
LANGUAGES=en,es,fr
```

If not specified, it defaults to `en` only.

### 3. Fetch Translations

Run the fetch script to download all language translations:

```bash
npm run fetch-data
```

This will:
- Connect to your Google Sheet
- Fetch data from each language sheet (en, es, fr, etc.)
- Generate JSON files in `src/i18n/locales/` (e.g., `en.json`, `es.json`, `fr.json`)

### 4. Language Detection

The app automatically detects the user's language preference from:
1. Browser language settings
2. Previously selected language (stored in localStorage)
3. Falls back to English if the detected language is not available

## How It Works

### Automatic Language Loading

The i18n configuration (`src/i18n/config.ts`) automatically loads all JSON files from `src/i18n/locales/`:

```typescript
// Dynamically imports all .json files from locales folder
const localeModules = import.meta.glob('./locales/*.json', { eager: true });
```

### Adding a New Language

1. Create a new sheet in your Google Spreadsheet (e.g., `de` for German)
2. Copy the structure from an existing language sheet
3. Translate all values in column B
4. Add the language code to your `.env.local`:
   ```bash
   LANGUAGES=en,es,fr,de
   ```
5. Run `npm run fetch-data`

The new language will be automatically available in the app!

## Language Switching

Users can switch languages by:
- Using the browser's language preference
- The app will automatically detect and use the closest available language

## File Structure

```
src/
  i18n/
    config.ts           # i18n configuration (auto-loads all languages)
    locales/
      en.json          # English translations (generated)
      es.json          # Spanish translations (generated)
      fr.json          # French translations (generated)
```

## GitHub Actions

The deployment workflow automatically fetches all configured languages before building:

```yaml
- name: Fetch data from Google Sheets
  run: npm run fetch-data
  env:
    LANGUAGES: en,es,fr
```

Make sure to set the `LANGUAGES` secret in your GitHub repository settings.

## Notes

- Translation files (`*.json`) are gitignored and generated from Google Sheets
- Always use Google Sheets as the source of truth for translations
- The app falls back to English if a translation is missing in other languages
