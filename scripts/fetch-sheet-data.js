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

    // Fetch the config sheet (key-value pairs)
    const configResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Config!A1:B1000",
    });

    const configData = configResponse.data.values;
    if (!configData || configData.length < 2) {
      console.error("Error: Config sheet is empty or has no data");
      process.exit(1);
    }

    console.log(`  ✓ Fetched Config: ${configData.length - 1} rows`);

    // Parse config data (skip header row)
    const config = {};
    configData.slice(1).forEach((row) => {
      if (row[0]) {
        config[row[0]] = row[1] || "";
      }
    });

    // Read the original guidebook-data.json to preserve array-based data
    const originalJsonPath = path.join(
      __dirname,
      "../src/assets/guidebook-data.json",
    );
    const originalData = JSON.parse(fs.readFileSync(originalJsonPath, "utf-8"));

    // Transform the config data into guidebook format
    const guidebookData = transformToGuidebookFormat(config, originalData);

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

// Transform config data to match guidebook-data.json structure
function transformToGuidebookFormat(config, originalData) {
  // Convert \n to actual newlines in text values
  Object.keys(config).forEach((key) => {
    if (typeof config[key] === "string") {
      config[key] = config[key].replace(/\\n/g, "\n");
    }
  });

  const guidebook = {
    welcome: {
      introMessages: [
        config.welcome_intro_message_1 || "",
        config.welcome_intro_message_2 || "",
      ],
      featuresSection: {
        title: config.welcome_features_title || "",
        answer: config.welcome_features_answer || "",
        description: config.welcome_features_description || "",
        features: originalData.welcome.featuresSection.features,
        note: config.welcome_features_note || "",
      },
      addToPhone: {
        icon: config.welcome_add_to_phone_icon || "",
        title: config.welcome_add_to_phone_title || "",
        messages: [
          config.welcome_add_to_phone_message_1 || "",
          config.welcome_add_to_phone_message_2 || "",
        ],
      },
      meetYourTeam: {
        title: config.welcome_meet_team_title || "",
        photoPlaceholder: config.welcome_meet_team_photo || "",
        hostWelcome: {
          icon: config.welcome_host_icon || "",
          title: config.welcome_host_title || "",
          description: config.welcome_host_description || "",
          teamIntro: config.welcome_host_team_intro || "",
          teamMembers: originalData.welcome.meetYourTeam.hostWelcome.teamMembers,
        },
        founderNote: {
          icon: config.welcome_founder_icon || "",
          title: config.welcome_founder_title || "",
          message: config.welcome_founder_message || "",
          mission: config.welcome_founder_mission || "",
          closing: config.welcome_founder_closing || "",
        },
      },
    },
    propertyInfo: {
      name: config.property_name || "",
      address: config.property_address || "",
      addressTitle: config.property_address_title || "",
      wifi: {
        network: config.property_wifi_network || "",
        password: config.property_wifi_password || "",
        title: config.property_wifi_title || "",
        networkLabel: config.property_wifi_network_label || "",
        passwordLabel: config.property_wifi_password_label || "",
      },
      checkIn: config.property_checkin_time || "",
      checkInLabel: config.property_checkin_label || "",
      checkOut: config.property_checkout_time || "",
      checkOutLabel: config.property_checkout_label || "",
      email: config.property_email || "",
      phone: config.property_phone || "",
      phoneLabel: config.property_phone_label || "",
    },
    checkInOut: {
      sectionTitle: config.checkinout_section_title || "",
      checkIn: {
        title: config.checkin_title || "",
        subheading: config.checkin_subheading || "",
        arrivingEarlyLabel: config.checkin_arriving_early_label || "",
        steps: originalData.checkInOut.checkIn.steps,
      },
      checkOut: {
        title: config.checkout_title || "",
        subheading: config.checkout_subheading || "",
        steps: originalData.checkInOut.checkOut.steps,
      },
      tip: config.checkinout_tip || "",
    },
    transport: {
      ...originalData.transport,
      sectionTitle: config.transport_section_title || "",
      faresLabel: config.transport_fares_label || "",
      pleaseNoteLabel: config.transport_please_note_label || "",
    },
    houseRules: originalData.houseRules,
    amenitiesSection: {
      sectionTitle: config.amenities_section_title || "",
      serviceInfoLabel: config.amenities_service_info_label || "",
      howToUseLabel: config.amenities_how_to_use_label || "",
      helpTip: {
        title: config.amenities_help_tip_title || "",
        message: config.amenities_help_tip_message || "",
      },
    },
    amenities: originalData.amenities,
    localGuide: {
      sectionTitle: config.localguide_section_title || "",
      viewOnMapsLabel: config.localguide_view_on_maps_label || "",
      packingListIntro: config.localguide_packing_list_intro || "",
      recommendations: originalData.localGuide.recommendations,
      tip: originalData.localGuide.tip,
      packingList: originalData.localGuide.packingList,
    },
    emergency: {
      sectionTitle: config.emergency_section_title || "",
      beachesLabel: config.emergency_beaches_label || "",
      freshwaterLabel: config.emergency_freshwater_label || "",
      addressNoteLabel: config.emergency_address_note_label || "",
      alert: originalData.emergency.alert,
      contacts: originalData.emergency.contacts,
      safetyInfo: originalData.emergency.safetyInfo,
      addressNote: originalData.emergency.addressNote,
      waterSafety: originalData.emergency.waterSafety,
    },
  };

  return guidebook;
}

fetchSheetData();
