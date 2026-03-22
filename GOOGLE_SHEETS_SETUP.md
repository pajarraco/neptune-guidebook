# Google Sheets Integration Setup Guide

This guide will help you set up Google Sheets integration to manage your guidebook data dynamically.

## Overview

The app fetches data from a private Google Sheet during the build process, keeping your data secure while allowing easy updates without code changes.

## Step 1: Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it something like "Neptune Guidebook Data"
4. Create a sheet named `GuidebookData`

### Sample Sheet Structure

Create columns with these headers (first row):

| propertyName | address | wifiNetwork | wifiPassword | checkInTime | checkOutTime |
|--------------|---------|-------------|--------------|-------------|--------------|
| Coastal Haven in Broadbeach-Gold Coast | Unit {{APARTMENT_NUMBER}}, 30-34 Surf Parade, Broadbeach, Qld 4218 | | | 3:00 PM | 10:00 AM |

**Note:** You can expand this structure to include more sections like transport, amenities, local guide, etc. You'll need to customize the `transformToGuidebookFormat()` function in `scripts/fetch-sheet-data.js` to match your sheet structure.

## Step 2: Create a Google Cloud Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or select an existing one)
   - Click "Select a project" → "New Project"
   - Name it "Neptune Guidebook" or similar
   - Click "Create"

3. Enable Google Sheets API
   - Go to "APIs & Services" → "Library"
   - Search for "Google Sheets API"
   - Click on it and click "Enable"

4. Create a Service Account
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "Service Account"
   - Name: `neptune-guidebook-fetcher`
   - Description: "Service account for fetching guidebook data"
   - Click "Create and Continue"
   - Skip the optional steps (click "Continue" then "Done")

5. Create a Service Account Key
   - Click on the service account you just created
   - Go to the "Keys" tab
   - Click "Add Key" → "Create new key"
   - Choose "JSON" format
   - Click "Create"
   - **Save this JSON file securely** - you'll need it in the next step

## Step 3: Share Your Google Sheet with the Service Account

1. Open the JSON key file you downloaded
2. Find the `client_email` field (looks like: `neptune-guidebook-fetcher@project-name.iam.gserviceaccount.com`)
3. Copy this email address
4. Go back to your Google Sheet
5. Click the "Share" button
6. Paste the service account email
7. Set permission to "Viewer" (read-only)
8. Uncheck "Notify people"
9. Click "Share"

Your sheet is now accessible only to you and the service account - it's private!

## Step 4: Get Your Google Sheet ID

1. Open your Google Sheet
2. Look at the URL: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
3. Copy the `SHEET_ID_HERE` part (the long string between `/d/` and `/edit`)

## Step 5: Add Secrets to GitHub

1. Go to your GitHub repository
2. Click "Settings" → "Secrets and variables" → "Actions"

### Add Secret (for service account credentials):
1. Click "New repository secret"
2. Name: `GOOGLE_SERVICE_ACCOUNT_KEY`
3. Value: Open the JSON key file and copy **the entire contents**
4. Click "Add secret"

### Add Variable (for sheet ID):
1. Click on the "Variables" tab
2. Click "New repository variable"
3. Name: `GOOGLE_SHEET_ID`
4. Value: Paste your Google Sheet ID from Step 4
5. Click "Add variable"

## Step 6: Test Locally (Optional)

To test the integration locally:

1. Create a `.env.local` file in your project root:
```bash
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"..."}' # Paste entire JSON
GOOGLE_SHEET_ID=your_sheet_id_here
```

2. Run the fetch script:
```bash
npm run fetch-data
```

3. Check that `src/assets/guidebook-data.json` was updated

## Step 7: Customize the Data Transformation

The current script in `scripts/fetch-sheet-data.js` has a basic transformation. You'll need to customize the `transformToGuidebookFormat()` function to match your sheet structure and include all sections:

- Property Info
- Check In/Out
- Transport
- House Rules
- Amenities
- Local Guide
- Emergency

You can organize your sheet with:
- Multiple sheets (tabs) for different sections
- Multiple rows with section identifiers
- Whatever structure works best for you

Just update the fetch script to parse your structure correctly.

## How It Works

1. You edit your Google Sheet
2. Push any commit to GitHub (or manually trigger the workflow)
3. GitHub Actions runs `npm run build`
4. The build script runs `npm run fetch-data` first
5. The fetch script downloads your sheet data using the service account
6. Data is saved to `src/assets/guidebook-data.json`
7. The app builds with the fresh data
8. Deploys to GitHub Pages

## Security Notes

✅ **Secure:**
- Google Sheet is private (only shared with service account)
- Service account credentials stored in GitHub Secrets (encrypted)
- No credentials exposed in the browser
- No public API access

✅ **Best Practices:**
- Never commit the service account JSON file to git
- Keep sensitive data (like codes) in GitHub Variables, not the sheet
- The sheet is for content that changes frequently (property info, local guide, etc.)

## Troubleshooting

**Error: "No data found in the sheet"**
- Check that your sheet is named `GuidebookData`
- Verify the range in the script matches your data

**Error: "GOOGLE_SERVICE_ACCOUNT_KEY environment variable not set"**
- Make sure you added the secret in GitHub
- For local testing, check your `.env.local` file

**Error: "The caller does not have permission"**
- Verify you shared the sheet with the service account email
- Check that the Google Sheets API is enabled in Google Cloud

**Build fails after adding this feature**
- Check the GitHub Actions logs for specific errors
- Verify the JSON in GOOGLE_SERVICE_ACCOUNT_KEY is valid
- Make sure GOOGLE_SHEET_ID is correct
