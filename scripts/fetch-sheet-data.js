import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, "../.env.local") });

async function fetchSheetData() {
  try {
    // Get service account credentials from environment variable or file
    const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    const credentialsPath = process.env.GOOGLE_SERVICE_ACCOUNT_PATH;

    let credentialsObj;

    // Option 1: Load from file path (recommended for local development)
    if (credentialsPath) {
      try {
        const fullPath = path.isAbsolute(credentialsPath)
          ? credentialsPath
          : path.join(__dirname, "..", credentialsPath);
        const fileContent = fs.readFileSync(fullPath, "utf8");
        credentialsObj = JSON.parse(fileContent);
        console.log("✓ Loaded credentials from file");
      } catch (fileError) {
        console.error(
          "Error loading credentials from file:",
          fileError.message,
        );
        process.exit(1);
      }
    }
    // Option 2: Parse from JSON string (for CI/CD)
    else if (credentials) {
      try {
        credentialsObj = JSON.parse(credentials);

        // Replace escaped newlines in private_key with actual newlines
        if (credentialsObj.private_key) {
          credentialsObj.private_key = credentialsObj.private_key
            .replace(/\\\\n/g, "\n")
            .replace(/\\n/g, "\n");
        }
        console.log("✓ Loaded credentials from environment variable");
      } catch (parseError) {
        console.error(
          "Error parsing GOOGLE_SERVICE_ACCOUNT_KEY JSON:",
          parseError.message,
        );
        console.error("Make sure the JSON is valid and properly formatted");
        process.exit(1);
      }
    } else {
      console.error(
        "Error: Neither GOOGLE_SERVICE_ACCOUNT_KEY nor GOOGLE_SERVICE_ACCOUNT_PATH is set",
      );
      console.error(
        "Set one of these environment variables in your .env.local file",
      );
      process.exit(1);
    }

    const auth = new google.auth.GoogleAuth({
      credentials: credentialsObj,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Get spreadsheet ID from environment variable
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      console.error("Error: GOOGLE_SHEET_ID environment variable not set");
      process.exit(1);
    }

    console.log("Fetching data from Google Sheets...");

    // Define all the sheets to fetch
    const sheetNames = [
      "property-info",
      "check-in-steps",
      "check-out-steps",
      "transport",
      "house-rules",
      "amenities",
      "local-guide",
      "emergency-contacts",
    ];

    // Fetch all sheets in parallel
    const fetchPromises = sheetNames.map((sheetName) =>
      sheets.spreadsheets.values
        .get({
          spreadsheetId,
          range: `${sheetName}!A1:Z1000`,
        })
        .then((response) => ({ sheetName, data: response.data.values }))
        .catch((error) => {
          console.error(
            `  ⚠ Warning: Could not fetch sheet "${sheetName}": ${error.message}`,
          );
          return { sheetName, data: null };
        }),
    );

    const results = await Promise.all(fetchPromises);

    // Convert results to a map
    const sheetsData = {};
    results.forEach(({ sheetName, data }) => {
      if (data && data.length > 0) {
        sheetsData[sheetName] = parseSheetData(data);
        console.log(`  ✓ Fetched ${sheetName}: ${data.length - 1} rows`);
      }
    });

    // Transform the data into guidebook format
    const guidebookData = transformToGuidebookFormat(sheetsData);

    // Write to the assets folder
    const outputPath = path.join(
      __dirname,
      "../src/assets/guidebook-data.json",
    );
    fs.writeFileSync(outputPath, JSON.stringify(guidebookData, null, 2));

    console.log("\n✓ Successfully fetched and saved guidebook data");
    console.log(`  Output: ${outputPath}`);
  } catch (error) {
    console.error("Error fetching sheet data:", error.message);
    process.exit(1);
  }
}

// Parse sheet data (convert rows to objects with headers as keys)
function parseSheetData(rows) {
  if (!rows || rows.length < 2) return [];

  const headers = rows[0];
  return rows.slice(1).map((row) => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || "";
    });
    return obj;
  });
}

// Transform sheet data to match guidebook-data.json structure
function transformToGuidebookFormat(sheetsData) {
  const guidebook = {};

  // Property Info
  if (sheetsData["property-info"] && sheetsData["property-info"][0]) {
    const prop = sheetsData["property-info"][0];
    guidebook.propertyInfo = {
      name: prop.propertyName || "",
      address: prop.address || "",
      wifi: {
        network: prop.wifiNetwork || "",
        password: prop.wifiPassword || "",
      },
      checkIn: prop.checkInTime || "",
      checkOut: prop.checkOutTime || "",
    };
  }

  // Check In/Out
  guidebook.checkInOut = {
    checkIn: {
      title: "Check-in Process",
      steps:
        sheetsData["check-in-steps"]?.map((row) => row.stepDescription) || [],
    },
    checkOut: {
      title: "Check-out Process",
      steps:
        sheetsData["check-out-steps"]?.map((row) => row.stepDescription) || [],
    },
    tip: "Tip: Early check-in or late check-out may be available - please enquire at least 48 hours in advance. Additional fees may apply.",
  };

  // Transport
  if (sheetsData["transport"]) {
    const transportData = sheetsData["transport"];
    guidebook.transport = {};

    transportData.forEach((row) => {
      const key = row.section.toLowerCase().replace(/\s+/g, "");

      if (key === "parking") {
        guidebook.transport.parking = {
          title: row.title,
          description: row.description,
        };
      } else if (key === "rideshare") {
        guidebook.transport.rideshare = {
          title: row.title,
          description: row.description,
        };
      } else if (key === "publictransport") {
        guidebook.transport.publicTransport = {
          title: row.title,
          description: row.description,
          info: row.info || "",
          fares: row.fares || "",
        };
      } else if (key === "airporttransfers") {
        let options = [];

        // Try to parse options from JSON array
        if (row.info && row.info.trim()) {
          try {
            options = JSON.parse(row.info.trim());
          } catch (e) {
            console.warn(
              "Failed to parse airport transfer options JSON:",
              e.message,
            );
          }
        }

        guidebook.transport.airportTransfers = {
          title: row.title,
          description: row.description,
          options: options,
          note: row.notes || "",
        };
      } else if (key === "carrental") {
        guidebook.transport.carRental = {
          title: row.title,
          description: row.description,
          note: row.notes || "",
        };
      }
    });
  }

  // House Rules
  if (sheetsData["house-rules"]) {
    guidebook.houseRules = {
      rules: sheetsData["house-rules"].map((row) => ({
        icon: row.icon,
        title: row.title,
        description: row.description,
      })),
      importantNote: {
        title: "Important - Body Corporate Rules",
        message:
          "This apartment is subject to body corporate by-laws. Violations may result in fines, immediate eviction without refund, and loss of security bond. Please respect all residents and building rules.",
      },
    };
  }

  // Amenities
  if (sheetsData["amenities"]) {
    guidebook.amenities = sheetsData["amenities"].map((row) => ({
      name: row.name,
      description: row.description,
      instructions: row.instructions,
    }));
  }

  // Local Guide
  if (sheetsData["local-guide"]) {
    guidebook.localGuide = {
      recommendations: sheetsData["local-guide"].map((row) => ({
        category: row.category,
        name: row.name,
        description: row.description,
        address: row.address,
        distance: row.distance,
        link: row.link,
      })),
      tip: "Getting Around: G:link light rail stops at Broadbeach South (3 min walk) - connects to Surfers Paradise and Southport. Uber and DiDi readily available. Free parking at Pacific Fair for 3 hours.",
    };
  }

  // Emergency
  if (sheetsData["emergency-contacts"]) {
    guidebook.emergency = {
      alert: {
        title: "In Case of Emergency",
        message:
          "For life-threatening emergencies, always call <strong>000</strong> (Triple Zero) for Police, Fire or Ambulance.",
      },
      contacts: sheetsData["emergency-contacts"].map((row) => ({
        type: row.type,
        name: row.name,
        phone: row.phone,
      })),
      safetyInfo: {
        title: "Safety Equipment",
        items: [
          "Fire extinguisher: Located in kitchen cupboard",
          "First aid kit: Bathroom vanity drawer",
          "Emergency exits: Main door and fire stairs at end of corridor",
          "Smoke alarms: Installed throughout apartment (tested quarterly)",
          "Fire evacuation plan: Posted on back of main door",
        ],
      },
      addressNote:
        "Address for Emergency Services: Broadbeach, Gold Coast, Queensland 4218 (provide specific unit number when calling)",
    };
  }

  return guidebook;
}

fetchSheetData();
