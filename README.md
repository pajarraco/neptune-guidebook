# Neptune Guidebook

A modern, interactive digital guidebook for vacation rental properties built with React, TypeScript, and Vite.

## Features

- 🔐 Secure access code entry
- 📱 Mobile-friendly responsive design
- � Multi-language support (English, Spanish, French, Italian)
- �🏠 Property information and amenities
- 🗺️ Local area guide
- 🔄 Dynamic content from Google Sheets
- 🚀 Automated deployment to GitHub Pages

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Fetch data from Google Sheets
npm run fetch-data
```

## Environment Variables

The app uses GitHub Variables and Secrets for configuration:

**GitHub Variables:**

- `VITE_CODE` - Access code for the guidebook
- `VITE_APARTMENT_NUMBER` - Unit/apartment number
- `VITE_WIFI_NETWORK` - WiFi network name
- `VITE_WIFI_PASSWORD` - WiFi password
- `GOOGLE_SHEET_ID` - Google Sheet ID for data fetching
- `LANGUAGES` - Comma-separated list of language codes (e.g., "en,es,fr,it")

**GitHub Secrets:**

- `GOOGLE_SERVICE_ACCOUNT_KEY` - Service account credentials JSON

**Local Development (.env.local):**

```env
VITE_CODE=your-access-code
VITE_APARTMENT_NUMBER=123
GOOGLE_SHEET_ID=your-sheet-id
GOOGLE_SERVICE_ACCOUNT_PATH=./path/to/credentials.json
LANGUAGES=en,es,fr,it
```

## Internationalization (i18n)

### Language Support

The app supports multiple languages using `react-i18next`. Translation files are located in `src/i18n/locales/`:

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
  "link": "property-info"  // ✅ Section ID, not translated
}
```

**Example (Incorrect)**:
```json
{
  "text": "Código Wi-Fi",
  "link": "información de la propiedad"  // ❌ Translated text
}
```

### Google Sheets Integration

The `scripts/fetch-sheet-data.js` script fetches content from Google Sheets and generates translation files:

**How it works**:
1. Reads data from separate sheets for each language (e.g., `en`, `es`, `fr`, `it`)
2. Transforms key-value pairs into the guidebook JSON structure
3. **Automatically excludes `link` properties for non-English languages**
4. Writes to `src/i18n/locales/{lang}.json`

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

## Tech Stack

- React 19 with TypeScript
- Vite 8
- i18next / react-i18next for internationalization
- Google Sheets API
- GitHub Actions for CI/CD
- GitHub Pages for hosting

## Project Structure

```
src/
├── components/          # React components
│   ├── LanguageSelector.tsx  # Language dropdown (fixed top-right)
│   ├── Navigation.tsx         # Section navigation
│   └── ...
├── i18n/
│   ├── config.ts       # i18next configuration
│   └── locales/        # Translation files (en, es, fr, it)
├── types/              # TypeScript type definitions
└── App.tsx             # Main application component

scripts/
└── fetch-sheet-data.js # Google Sheets data fetcher
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
