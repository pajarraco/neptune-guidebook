import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fetchSheetData() {
  try {
    // Get service account credentials from environment variable
    const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    
    if (!credentials) {
      console.error('Error: GOOGLE_SERVICE_ACCOUNT_KEY environment variable not set');
      process.exit(1);
    }

    // Parse the credentials JSON
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(credentials),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Get spreadsheet ID from environment variable
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    
    if (!spreadsheetId) {
      console.error('Error: GOOGLE_SHEET_ID environment variable not set');
      process.exit(1);
    }

    console.log('Fetching data from Google Sheets...');

    // Fetch the data from the sheet
    // Adjust the range based on your sheet structure
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'GuidebookData!A1:Z1000', // Adjust range as needed
    });

    const rows = response.data.values;
    
    if (!rows || rows.length === 0) {
      console.error('No data found in the sheet');
      process.exit(1);
    }

    // Convert sheet data to JSON format
    // Assuming first row is headers
    const headers = rows[0];
    const data = rows.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });

    // Transform the data into your guidebook format
    // This is a basic example - you'll need to customize based on your sheet structure
    const guidebookData = transformToGuidebookFormat(data);

    // Write to the assets folder
    const outputPath = path.join(__dirname, '../src/assets/guidebook-data.json');
    fs.writeFileSync(outputPath, JSON.stringify(guidebookData, null, 2));

    console.log('✓ Successfully fetched and saved guidebook data');
    console.log(`  Output: ${outputPath}`);
    
  } catch (error) {
    console.error('Error fetching sheet data:', error.message);
    process.exit(1);
  }
}

// Transform sheet data to match your current guidebook-data.json structure
function transformToGuidebookFormat(data) {
  // This is a placeholder - customize based on your actual sheet structure
  // For now, we'll create a basic structure that matches your current format
  
  // You can organize your sheet with different sections:
  // - PropertyInfo sheet
  // - CheckInOut sheet
  // - Transport sheet
  // - etc.
  
  // Example transformation (customize this based on your needs):
  return {
    propertyInfo: {
      name: data[0]?.propertyName || "Coastal Haven in Broadbeach-Gold Coast",
      address: data[0]?.address || "Unit {{APARTMENT_NUMBER}}, 30-34 Surf Parade, Broadbeach, Qld 4218",
      wifi: {
        network: data[0]?.wifiNetwork || "",
        password: data[0]?.wifiPassword || ""
      },
      checkIn: data[0]?.checkInTime || "3:00 PM",
      checkOut: data[0]?.checkOutTime || "10:00 AM"
    },
    // Add more sections as needed based on your sheet structure
  };
}

fetchSheetData();
