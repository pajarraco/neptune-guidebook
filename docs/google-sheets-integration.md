# Google Sheets Integration

## Overview

The project uses Google Sheets as a CMS for managing guidebook content across multiple languages. The `fetch-sheet-data.js` script fetches data and generates JSON translation files.

## Setup

### Prerequisites

1. Google Cloud Project with Sheets API enabled
2. Service Account with access to the spreadsheet
3. Service Account credentials (JSON file)

### Environment Variables

**Required:**

- `GOOGLE_SHEET_ID` - The spreadsheet ID from the URL
- `GOOGLE_SERVICE_ACCOUNT_KEY` (production) or `GOOGLE_SERVICE_ACCOUNT_PATH` (local)
- `LANGUAGES` - Comma-separated language codes (e.g., "en,es,fr,it")

**Example .env.local:**

```env
GOOGLE_SHEET_ID=1abc123def456ghi789jkl
GOOGLE_SERVICE_ACCOUNT_PATH=./credentials/service-account.json
LANGUAGES=en,es,fr,it
```

## Google Sheets Structure

### Sheet Organization

- **One tab per language** (e.g., `en`, `es`, `fr`, `it`)
- Each tab contains key-value pairs
- Column A: Key (technical identifier)
- Column B: Value (translated content)

### Key Naming Convention

**Simple values:**

```
property_name
property_address
welcome_features_title
```

**Numbered items (arrays):**

```
welcome_intro_message_1
welcome_intro_message_2
welcome_feature_1_text
welcome_feature_1_icon
welcome_feature_1_link
```

**Nested objects:**

```
property_wifi_network
property_wifi_password
emergency_alert_title
emergency_alert_message
```

### Special Formatting

**Line breaks:**
Use `\n` in the sheet, which will be converted to actual newlines:

```
Welcome message.\nSecond line.
```

**HTML in content:**
Use HTML tags for formatting (e.g., `<strong>`, `<br>`):

```
Use code <strong>1234</strong># to enter
```

## Script Functionality

### Main Function: `fetchSheetData()`

**Process:**

1. Authenticates with Google Sheets API
2. Reads `LANGUAGES` environment variable
3. For each language:
   - Fetches data from corresponding sheet tab
   - Parses key-value pairs
   - Transforms into guidebook JSON structure
   - Writes to `src/i18n/locales/{lang}.json`

### Transform Function: `transformToGuidebookFormat(config, language)`

**Key Features:**

- Converts flat key-value pairs to nested JSON structure
- Handles numbered items (arrays)
- Handles nested objects
- **Language-specific logic**: Excludes `link` properties for non-English languages

**Example transformation:**

```javascript
// Input (from sheet):
{
  'welcome_feature_1_text': 'Wi-Fi Code',
  'welcome_feature_1_link': 'property-info',
  'welcome_feature_2_text': 'Check-in instructions',
  'welcome_feature_2_link': 'check-in-out'
}

// Output (en.json):
{
  "welcome": {
    "featuresSection": {
      "features": [
        { "text": "Wi-Fi Code", "link": "property-info" },
        { "text": "Check-in instructions", "link": "check-in-out" }
      ]
    }
  }
}

// Output (es.json):
{
  "welcome": {
    "featuresSection": {
      "features": [
        { "text": "Código Wi-Fi" },  // No 'link' property
        { "text": "Instrucciones de check-in" }
      ]
    }
  }
}
```

### Helper Functions

**`getNumberedItems(config, prefix, properties)`**

- Extracts numbered items from config
- Creates array of objects with specified properties
- Stops when next number doesn't exist

Example:

```javascript
getNumberedItems(config, "welcome_feature", ["icon", "text", "link"]);
// Returns: [{ icon: '...', text: '...', link: '...' }, ...]
```

**`getNumberedSimpleItems(config, prefix)`**

- Extracts numbered simple values (strings)
- Creates array of strings

Example:

```javascript
getNumberedSimpleItems(config, "welcome_intro_message");
// Returns: ['Message 1', 'Message 2', ...]
```

## Running the Script

### Command

```bash
npm run fetch-data
```

### What Happens

1. Script connects to Google Sheets
2. Fetches all language tabs specified in `LANGUAGES`
3. Generates/overwrites JSON files in `src/i18n/locales/`
4. Outputs success/error messages

### Expected Output

```
Fetching data from Google Sheets...
Languages to fetch: en, es, fr, it

Fetching en...
  ✓ Fetched en: 150 rows
  ✓ Saved: /path/to/src/i18n/locales/en.json

Fetching es...
  ✓ Fetched es: 150 rows
  ✓ Saved: /path/to/src/i18n/locales/es.json

...

✓ Successfully fetched and saved all language data
```

## Important Rules for Sheet Editing

### DO:

- ✅ Keep key names consistent across all language tabs
- ✅ Use the same numbering sequence for all languages
- ✅ Use `\n` for line breaks
- ✅ Put section IDs in link columns (e.g., `property-info`)
- ✅ Test after fetching to ensure JSON is valid

### DON'T:

- ❌ Translate key names (Column A) - only translate values (Column B)
- ❌ Put translated text in link columns
- ❌ Skip numbers in sequences (e.g., feature_1, feature_3 - missing feature_2)
- ❌ Use different structures across language tabs
- ❌ Include quotes or special JSON characters without escaping

## Troubleshooting

### Error: "Sheet is empty or has no data"

**Cause**: Sheet tab doesn't exist or has no content  
**Solution**: Verify tab name matches language code exactly

### Error: "GOOGLE_SHEET_ID environment variable not set"

**Cause**: Missing environment variable  
**Solution**: Add to `.env.local` or GitHub Variables

### Error: "Error parsing GOOGLE_SERVICE_ACCOUNT_KEY JSON"

**Cause**: Invalid JSON in credentials  
**Solution**: Verify JSON format, check for escaped newlines in private_key

### Links not working after fetch

**Cause**: Link columns contain translated text instead of section IDs  
**Solution**: Update Google Sheet to use section IDs, re-run fetch

### Missing translations

**Cause**: Key mismatch between language tabs  
**Solution**: Ensure all language tabs have the same keys in Column A

## Adding New Content

### Adding a New Feature

1. Add to English sheet:
   ```
   welcome_feature_4_text | New feature text
   welcome_feature_4_icon | icon_name
   welcome_feature_4_link | section-id
   ```
2. Add translations to other language sheets (without link):
   ```
   welcome_feature_4_text | Texto de nueva función
   welcome_feature_4_icon | icon_name
   ```
3. Run `npm run fetch-data`

### Adding a New Section

1. Update `transformToGuidebookFormat()` function to handle new keys
2. Add keys to all language sheets
3. Update TypeScript types if needed
4. Run `npm run fetch-data`

## Security Notes

- **Never commit** service account credentials to git
- Use `.gitignore` to exclude credential files
- Store credentials in GitHub Secrets for CI/CD
- Limit service account permissions to read-only for the specific sheet
- Regularly rotate service account keys
