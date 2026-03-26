# Google Sheets Translation Guide

This guide shows you how to set up and manage multiple languages using Google Sheets.

## Step 1: Create Language Sheets

1. Open your Google Spreadsheet
2. You should already have an `en` sheet with all your English content
3. Duplicate the `en` sheet:
   - Right-click on the `en` tab at the bottom
   - Select "Duplicate"
   - Rename the copy to `es` (for Spanish)
4. Repeat for French:
   - Duplicate the `en` sheet again
   - Rename to `fr`

Your spreadsheet should now have three sheets: `en`, `es`, `fr`

## Step 2: Translate Content in Google Sheets

### Option A: Use Google Translate Formula (Quick but needs review)

1. Open the `es` sheet
2. In cell B2 (first value cell), enter this formula:
   ```
   =GOOGLETRANSLATE(en!B2,"en","es")
   ```
3. Drag this formula down for all rows
4. Copy the translated values and paste as "Values only" to replace the formulas
5. Review and manually correct any translations that don't sound natural

Repeat for the `fr` sheet, changing `"es"` to `"fr"`:
```
=GOOGLETRANSLATE(en!B2,"en","fr")
```

### Option B: Manual Translation (Recommended for quality)

1. Open the `es` sheet
2. Go through column B and translate each English value to Spanish
3. Keep column A (keys) exactly the same - only translate column B (values)
4. Repeat for the `fr` sheet

### Option C: Hybrid Approach (Best)

1. Use Google Translate formula to get initial translations
2. Hire a native speaker or use a professional service to review and improve
3. Update the values in the sheet

## Step 3: Important Rules

### DO NOT translate these:
- **Column A (keys)**: Never change these - they must match exactly across all languages
- **Placeholders**: Keep `{{CODE}}`, `{{APARTMENT_NUMBER}}` exactly as-is
- **Icons**: Keep icon names like `wifi`, `key`, `beach_access` in English
- **Links**: Keep `"link": "property-info"` values in English
- **File names**: Keep `"Team Photo.jpg"` as-is

### DO translate these:
- All text in Column B (values)
- User-facing messages
- Descriptions
- Instructions
- Section titles

## Step 4: Special Considerations

### Placeholders
When you see text like:
```
"Use the access code <strong>{{CODE}}</strong># to enter"
```

Translate the text but keep the HTML tags and placeholder:
```
Spanish: "Usa el código de acceso <strong>{{CODE}}</strong># para entrar"
French: "Utilisez le code d'accès <strong>{{CODE}}</strong># pour entrer"
```

### Line Breaks
`\n` represents a line break. Keep these in your translations:
```
English: "Hi, I'm Thomas.\nWelcome to our home."
Spanish: "Hola, soy Thomas.\nBienvenido a nuestro hogar."
```

## Step 5: Fetch Translations

Once you've completed your translations in Google Sheets:

1. Update your `.env.local` file:
   ```bash
   LANGUAGES=en,es,fr
   ```

2. Run the fetch command:
   ```bash
   npm run fetch-data
   ```

3. This will download all three languages and create:
   - `src/i18n/locales/en.json`
   - `src/i18n/locales/es.json`
   - `src/i18n/locales/fr.json`

## Step 6: Test Your Translations

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Change your browser language to Spanish or French
3. Reload the page - it should display in the selected language
4. Check that all text is properly translated

## Tips for Quality Translations

### For Spanish (es):
- Use formal "usted" for professional tone, or informal "tú" for friendly tone
- Consider regional variations (Spain vs Latin America)
- Common phrases:
  - Check-in: "Registro de entrada"
  - Check-out: "Registro de salida"
  - Wi-Fi: "Wi-Fi" or "WiFi" (same)
  - Welcome: "Bienvenido/a"

### For French (fr):
- Use formal "vous" for professional tone
- Watch for gender agreements (masculine/feminine)
- Common phrases:
  - Check-in: "Enregistrement"
  - Check-out: "Départ"
  - Wi-Fi: "Wi-Fi" (same)
  - Welcome: "Bienvenue"

## Maintaining Translations

When you update content:

1. Update the `en` sheet in Google Sheets
2. Copy the new/changed rows to `es` and `fr` sheets
3. Translate the new content
4. Run `npm run fetch-data` to update your app
5. Commit and push changes

## Example Sheet Structure

Your sheets should look like this:

| key | value |
|-----|-------|
| welcome_intro_message_1 | Here's everything you need... |
| welcome_intro_message_2 | We know your free time... |
| property_name | Coastal Haven in Broadbeach |
| ... | ... |

**Spanish sheet (es):**

| key | value |
|-----|-------|
| welcome_intro_message_1 | Aquí está todo lo que necesitas... |
| welcome_intro_message_2 | Sabemos que tu tiempo libre... |
| property_name | Refugio Costero en Broadbeach |
| ... | ... |

**French sheet (fr):**

| key | value |
|-----|-------|
| welcome_intro_message_1 | Voici tout ce dont vous avez besoin... |
| welcome_intro_message_2 | Nous savons que votre temps libre... |
| property_name | Havre Côtier à Broadbeach |
| ... | ... |

## Troubleshooting

**Problem**: Translations not showing up
- Check that sheet names match exactly: `en`, `es`, `fr`
- Verify `LANGUAGES=en,es,fr` in `.env.local`
- Run `npm run fetch-data` again

**Problem**: Some text still in English
- Check that you translated all rows in the sheet
- Verify column A (keys) match exactly across all sheets
- Clear browser cache and reload

**Problem**: Broken formatting
- Check that HTML tags like `<strong>` are preserved
- Verify placeholders like `{{CODE}}` are not translated
- Check for matching quotes and brackets

## Need Help?

If you need professional translation services, consider:
- Gengo (https://gengo.com)
- Smartling (https://www.smartling.com)
- Local translation agencies in your area

For quick translations with AI assistance:
- DeepL (https://www.deepl.com) - Often better than Google Translate
- ChatGPT or Claude - Can provide context-aware translations
