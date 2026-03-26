# GitHub Actions Setup for Google Sheets Integration

## Overview

The GitHub Actions workflow automatically fetches the latest data from Google Sheets before each deployment. This ensures your deployed site always has the most up-to-date content.

## Required GitHub Secrets & Variables

### Secrets (Settings → Secrets and variables → Actions → Secrets)

#### `GOOGLE_SERVICE_ACCOUNT_KEY`
Your Google Cloud service account credentials in JSON format.

**How to set it up:**
1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `GOOGLE_SERVICE_ACCOUNT_KEY`
5. Value: Copy the **entire contents** of your `service-account.json` file
   ```json
   {
     "type": "service_account",
     "project_id": "your-project-id",
     "private_key_id": "...",
     "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
     "client_email": "your-service-account@your-project.iam.gserviceaccount.com",
     ...
   }
   ```
6. Click **Add secret**

### Variables (Settings → Secrets and variables → Actions → Variables)

#### `GOOGLE_SHEET_ID`
The ID of your Google Sheet containing the guidebook data.

**How to find it:**
- Open your Google Sheet
- Look at the URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
- Copy the `SPREADSHEET_ID` part

**How to set it up:**
1. Go to **Settings** → **Secrets and variables** → **Actions** → **Variables** tab
2. Click **New repository variable**
3. Name: `GOOGLE_SHEET_ID`
4. Value: Your spreadsheet ID
5. Click **Add variable**

#### Other Required Variables

You should already have these set up:
- `VITE_CODE` - Building access code
- `VITE_APARTMENT_NUMBER` - Apartment number
- `VITE_WIFI_NETWORK` - WiFi network name
- `VITE_WIFI_PASSWORD` - WiFi password

## How the Workflow Works

```yaml
1. Checkout code
2. Setup Node.js
3. Install dependencies (npm ci)
4. Fetch data from Google Sheets ← SEPARATE STEP
   - Uses GOOGLE_SERVICE_ACCOUNT_KEY
   - Uses GOOGLE_SHEET_ID
   - Creates src/assets/guidebook-data.json
5. Build the app
   - Uses VITE_* variables
   - Does NOT fetch data (already done in step 4)
6. Deploy to GitHub Pages
```

**Important:** The `npm run build` script no longer includes `fetch-data`. Data fetching is done as a separate step in the GitHub Actions workflow before building. This allows the build to work without requiring Google Sheets credentials.

## Deployment Flow

```
Edit content in Google Sheets
        ↓
Push to main branch (or manual trigger)
        ↓
GitHub Actions runs
        ↓
Fetches latest data from Google Sheets
        ↓
Builds app with fresh data
        ↓
Deploys to GitHub Pages
```

## Testing the Workflow

1. **Make a change in Google Sheets**
   - Edit any content in your Config sheet

2. **Trigger deployment**
   - Option A: Push any change to main branch
   - Option B: Go to Actions tab → "Deploy to GitHub Pages" → "Run workflow"

3. **Verify the deployment**
   - Check the Actions tab to see the workflow running
   - Look for "Fetch data from Google Sheets" step
   - Once complete, visit your site to see the updated content

## Troubleshooting

### "Error: GOOGLE_SERVICE_ACCOUNT_KEY is not set"
- Make sure you added the secret in GitHub Settings
- Check the secret name is exactly `GOOGLE_SERVICE_ACCOUNT_KEY`

### "Error: GOOGLE_SHEET_ID environment variable not set"
- Make sure you added the variable in GitHub Settings
- Check the variable name is exactly `GOOGLE_SHEET_ID`

### "The caller does not have permission"
- Verify you shared the Google Sheet with the service account email
- The email is in the `client_email` field of your service account JSON

### "Failed to fetch data"
- Check the Google Sheet ID is correct
- Verify the sheet is named exactly "Config"
- Make sure the service account has "Viewer" access to the sheet

## Local Development vs Production

**Local Development:**
- Uses `.env.local` file for credentials
- Run `node scripts/fetch-sheet-data.js` manually when you want to update

**Production (GitHub Actions):**
- Uses GitHub Secrets and Variables
- Automatically fetches data on every deployment
- No manual intervention needed

## Security Notes

⚠️ **Never commit these files:**
- `service-account.json` - Contains sensitive credentials
- `.env.local` - Contains local environment variables
- `src/assets/guidebook-data.json` - Generated file
- `config.csv` - Generated file

✅ **These are already in `.gitignore`**
