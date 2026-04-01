# Google Sheets Integration Scripts

## Overview

This folder contains scripts to sync content between Google Sheets (CSV) and the app's JSON data.

## Workflow

### 1. Export to Google Sheets

The CSV file `guidebook-data.csv` contains all editable text content in a simple key-value format.

**To edit content:**

1. Open `guidebook-data.csv` in Google Sheets (File → Import)
2. Edit the values in column B (keep column A keys unchanged)
3. Export as CSV when done (File → Download → CSV)
4. Save as `guidebook-data.csv` in the project root

### 2. Import from CSV back to JSON

After editing the CSV, run the conversion script:

```bash
node scripts/csv-to-json.js
```

This will:

- ✅ Read the CSV file
- ✅ Convert flat structure back to nested JSON
- ✅ Preserve array-based data (amenities, recommendations, contacts, etc.)
- ✅ Update `src/assets/guidebook-data.json`

### 3. Test the changes

```bash
npm run dev
```

Open the app and verify your changes appear correctly.

## What's in the CSV?

The CSV contains **configuration and labels only**:

- Welcome messages
- Feature descriptions
- Team member info
- Check-in/check-out steps
- Section titles and labels
- Property information

## What's NOT in the CSV?

These are kept in the JSON (too complex for CSV):

- Amenities list
- Local recommendations
- Emergency contacts
- House rules
- Transport options

To edit these, modify `src/assets/guidebook-data.json` directly.

## Important Notes

⚠️ **Do not modify the keys** (column A) - only edit values (column B)
⚠️ **Keep the CSV format** - two columns: `key,value`
⚠️ **Preserve placeholders** like `{{APARTMENT_NUMBER}}` and `{{CODE}}`
⚠️ **Preserve HTML tags** like `<strong>` in check-in steps

## Troubleshooting

**Script fails to run:**

```bash
# Make sure you're in the project root
cd /Users/wfh/Studio/neptune-guidebook
node scripts/csv-to-json.js
```

**Changes don't appear:**

- Check that the CSV was saved in the correct location
- Verify the script ran successfully
- Restart the dev server (`npm run dev`)

**CSV formatting issues:**

- Use proper CSV escaping for quotes: `"value with ""quotes"""`
- Multi-line values should use `\n` for line breaks
