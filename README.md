# Neptune Guidebook

A modern, interactive digital guidebook for vacation rental properties built with React, TypeScript, and Vite.

## Features

- 🔐 Secure access code entry
- 📱 Mobile-friendly responsive design
- 🏠 Property information and amenities
- 🗺️ Local area guide
- 🔄 Dynamic content from Google Sheets
- 🚀 Automated deployment to GitHub Pages

## Google Sheets Integration

This project fetches guidebook data from a private Google Sheet during the build process. This allows you to update property information, local guides, and other content without rebuilding the app.

**See [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md) for complete setup instructions.**

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
```

## Environment Variables

The app uses GitHub Variables and Secrets for configuration:

**GitHub Variables:**
- `VITE_CODE` - Access code for the guidebook
- `VITE_APARTMENT_NUMBER` - Unit/apartment number
- `VITE_WIFI_NETWORK` - WiFi network name
- `VITE_WIFI_PASSWORD` - WiFi password
- `GOOGLE_SHEET_ID` - Google Sheet ID for data fetching

**GitHub Secrets:**
- `GOOGLE_SERVICE_ACCOUNT_KEY` - Service account credentials JSON

## Tech Stack

- React 19 with TypeScript
- Vite 8
- Google Sheets API
- GitHub Actions for CI/CD
- GitHub Pages for hosting

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
