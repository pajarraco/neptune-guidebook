# Google Sheets Integration Setup

## Overview

This guide explains how to sync your guidebook content from Google Sheets to the app.

## Step 1: Create Google Sheets

1. **Import the CSV to Google Sheets**
   - Open Google Sheets
   - Create a new spreadsheet
   - Name it "Neptune Guidebook Data"
   - File → Import → Upload → Select `config.csv`
   - Import location: "Replace current sheet"
   - Separator type: "Comma"
   - Click "Import data"

2. **Rename the sheet to "Config"**
   - Right-click the sheet tab at the bottom
   - Select "Rename"
   - Enter "Config" (case-sensitive)

3. **Share the spreadsheet**
   - Click "Share" button
   - Add the service account email (from your credentials JSON)
   - Give "Viewer" access
   - Click "Done"

## Step 2: Set Up Google Cloud Service Account

1. **Go to Google Cloud Console**
   - Visit https://console.cloud.google.com/
   - Create a new project or select existing one

2. **Enable Google Sheets API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

3. **Create Service Account**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "Service Account"
   - Name: "neptune-guidebook-sync"
   - Click "Create and Continue"
   - Skip optional steps, click "Done"

4. **Create Service Account Key**
   - Click on the service account you just created
   - Go to "Keys" tab
   - Click "Add Key" → "Create new key"
   - Choose "JSON" format
   - Click "Create"
   - Save the downloaded JSON file as `service-account.json` in your project root

## Step 3: Configure Environment Variables

Create or update `.env.local` in your project root:

```env
# Google Sheets Configuration
GOOGLE_SHEET_ID=your_spreadsheet_id_here
GOOGLE_SERVICE_ACCOUNT_PATH=./service-account.json

# Alternative: Use JSON string (for CI/CD)
# GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"..."}'
```

**To find your Spreadsheet ID:**
- Open your Google Sheet
- Look at the URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
- Copy the `SPREADSHEET_ID` part

## Step 4: Test the Integration

Run the sync script:

```bash
node scripts/fetch-sheet-data.js
```

You should see:
```
✓ Loaded credentials from file
Fetching data from Google Sheets...
  ✓ Fetched Config: 59 rows

✓ Successfully fetched and saved guidebook data
  Output: /Users/wfh/Studio/neptune-guidebook/src/assets/guidebook-data.json
```

## Step 5: Edit Content in Google Sheets

1. **Open your Google Sheet**
2. **Edit values in column B** (don't change column A keys)
3. **Save changes** (auto-saved by Google Sheets)
4. **Run the sync script** to update your app:
   ```bash
   node scripts/fetch-sheet-data.js
   ```
5. **Restart your dev server** to see changes:
   ```bash
   npm run dev
   ```

## Important Notes

⚠️ **Do NOT modify column A** (the keys) - only edit column B (the values)

⚠️ **Preserve placeholders** like `{{APARTMENT_NUMBER}}` and `{{CODE}}`

⚠️ **Preserve HTML tags** like `<strong>` in check-in steps

⚠️ **Use `\n` for line breaks** in multi-line text (e.g., founder message)

## What's Editable in Google Sheets?

**100% of your guidebook content is now editable in the Config sheet** (289 rows total):

✅ **Welcome Section:**
- Intro messages (2)
- Features section (title, answer, description, note)
- Features list (4 items with icon, text, link)
- Add to phone messages (2)
- Meet your team (title, photo, host info, team intro)
- Team members list (5 items with icon, text)
- Founder note (icon, title, message, mission, closing)

✅ **Property Information:**
- Name, address, email, phone
- WiFi details and labels
- Check-in/out times and labels

✅ **Check-In/Out:**
- Section titles and subheadings
- Check-in steps (5 steps)
- Check-out steps (5 steps)
- Tips and labels

✅ **Section Labels:**
- Transport section title and labels
- Amenities section title and labels
- Local guide section title and labels
- Emergency section title and labels

✅ **Transport Options:**
- Parking details
- Rideshare information
- Public transport (title, description, info, fares, limitations)
- Airport transfers (title, description, options, note)
- Car rental information

✅ **House Rules:**
- Important note (title, message)
- 8 house rules (icon, title, description)

✅ **Amenities:**
- 7 amenities (name, description, instructions, service info, items)

✅ **Local Guide:**
- General tip
- Packing list (title, 6 items)
- 17 local recommendations (category, name, description, address, distance, link, note)

✅ **Emergency:**
- Alert message
- Safety info (title, 5 items)
- Water safety information
- Address note
- 7 emergency contacts (type, name, phone, address, hours, note)

## Troubleshooting

**"Error: GOOGLE_SHEET_ID environment variable not set"**
- Make sure `.env.local` exists with the correct spreadsheet ID

**"Error loading credentials from file"**
- Check that `service-account.json` exists in the project root
- Verify the path in `.env.local` is correct

**"The caller does not have permission"**
- Make sure you shared the Google Sheet with the service account email
- The email is in the `client_email` field of your `service-account.json`

**Changes don't appear in the app**
- Run `node scripts/fetch-sheet-data.js` after editing the sheet
- Restart the dev server with `npm run dev`
