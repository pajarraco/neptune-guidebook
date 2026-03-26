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

    // Transform the config data into guidebook format
    // Note: We don't need originalData anymore since all data comes from Google Sheets
    const guidebookData = transformToGuidebookFormat(config);

    // Write to the i18n locales folder
    const outputPath = path.join(
      __dirname,
      "../src/i18n/locales/en.json",
    );
    fs.writeFileSync(outputPath, JSON.stringify(guidebookData, null, 2));

    console.log("\n✓ Successfully fetched and saved guidebook data");
    console.log(`  Output: ${outputPath}`);
  } catch (error) {
    console.error("Error fetching sheet data:", error.message);
    process.exit(1);
  }
}

// Helper function to get numbered items from config
function getNumberedItems(config, prefix, properties) {
  const items = [];
  let i = 1;
  
  while (config[`${prefix}_${i}_${properties[0]}`] !== undefined) {
    const item = {};
    properties.forEach(prop => {
      const value = config[`${prefix}_${i}_${prop}`];
      if (value !== undefined && value !== '') {
        item[prop] = value;
      }
    });
    items.push(item);
    i++;
  }
  
  return items;
}

// Helper function to get numbered simple items (just strings)
function getNumberedSimpleItems(config, prefix) {
  const items = [];
  let i = 1;
  
  while (config[`${prefix}_${i}`] !== undefined) {
    items.push(config[`${prefix}_${i}`]);
    i++;
  }
  
  return items;
}

// Transform config data to match guidebook-data.json structure
function transformToGuidebookFormat(config) {
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
        features: getNumberedItems(config, 'welcome_feature', ['icon', 'text', 'link']),
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
          teamMembers: getNumberedItems(config, 'welcome_team_member', ['icon', 'text']),
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
        steps: getNumberedSimpleItems(config, 'checkin_step'),
      },
      checkOut: {
        title: config.checkout_title || "",
        subheading: config.checkout_subheading || "",
        steps: getNumberedSimpleItems(config, 'checkout_step'),
      },
      tip: config.checkinout_tip || "",
    },
    transport: {
      sectionTitle: config.transport_section_title || "",
      faresLabel: config.transport_fares_label || "",
      pleaseNoteLabel: config.transport_please_note_label || "",
      parking: config.transport_parking_title ? {
        title: config.transport_parking_title,
        description: config.transport_parking_description || "",
      } : undefined,
      rideshare: config.transport_rideshare_title ? {
        title: config.transport_rideshare_title,
        description: config.transport_rideshare_description || "",
      } : undefined,
      publicTransport: config.transport_public_title ? {
        title: config.transport_public_title,
        description: config.transport_public_description || "",
        info: config.transport_public_info || "",
        fares: config.transport_public_fares || "",
        limitations: config.transport_public_limitations,
      } : undefined,
      airportTransfers: config.transport_airport_title ? {
        title: config.transport_airport_title,
        description: config.transport_airport_description || "",
        options: getNumberedItems(config, 'transport_airport_option', ['name', 'phone', 'type']),
        note: config.transport_airport_note,
      } : undefined,
      carRental: config.transport_car_rental_title ? {
        title: config.transport_car_rental_title,
        description: config.transport_car_rental_description || "",
        note: config.transport_car_rental_note,
      } : undefined,
    },
    houseRules: {
      rules: getNumberedItems(config, 'house_rule', ['icon', 'title', 'description']),
      importantNote: {
        title: config.house_rules_important_note_title || "",
        message: config.house_rules_important_note_message || "",
      },
    },
    amenitiesSection: {
      sectionTitle: config.amenities_section_title || "",
      serviceInfoLabel: config.amenities_service_info_label || "",
      howToUseLabel: config.amenities_how_to_use_label || "",
      helpTip: {
        title: config.amenities_help_tip_title || "",
        message: config.amenities_help_tip_message || "",
      },
    },
    amenities: (() => {
      const amenities = [];
      let i = 1;
      while (config[`amenity_${i}_name`]) {
        const amenity = {
          name: config[`amenity_${i}_name`],
          description: config[`amenity_${i}_description`] || "",
        };
        if (config[`amenity_${i}_instructions`]) {
          amenity.instructions = config[`amenity_${i}_instructions`];
        }
        if (config[`amenity_${i}_service_info`]) {
          amenity.serviceInfo = config[`amenity_${i}_service_info`];
        }
        if (config[`amenity_${i}_items`]) {
          amenity.items = config[`amenity_${i}_items`].split(' | ');
        }
        amenities.push(amenity);
        i++;
      }
      return amenities;
    })(),
    localGuide: {
      sectionTitle: config.localguide_section_title || "",
      viewOnMapsLabel: config.localguide_view_on_maps_label || "",
      packingListIntro: config.localguide_packing_list_intro || "",
      recommendations: (() => {
        const recs = [];
        let i = 1;
        while (config[`local_rec_${i}_name`]) {
          const rec = {
            category: config[`local_rec_${i}_category`] || "",
            name: config[`local_rec_${i}_name`],
            description: config[`local_rec_${i}_description`] || "",
          };
          if (config[`local_rec_${i}_address`]) rec.address = config[`local_rec_${i}_address`];
          if (config[`local_rec_${i}_distance`]) rec.distance = config[`local_rec_${i}_distance`];
          if (config[`local_rec_${i}_link`]) rec.link = config[`local_rec_${i}_link`];
          if (config[`local_rec_${i}_note`]) rec.note = config[`local_rec_${i}_note`];
          recs.push(rec);
          i++;
        }
        return recs;
      })(),
      tip: config.local_guide_tip || "",
      packingList: config.local_guide_packing_list_title ? {
        title: config.local_guide_packing_list_title,
        items: getNumberedSimpleItems(config, 'local_guide_packing_item'),
      } : undefined,
    },
    emergency: {
      sectionTitle: config.emergency_section_title || "",
      beachesLabel: config.emergency_beaches_label || "",
      freshwaterLabel: config.emergency_freshwater_label || "",
      addressNoteLabel: config.emergency_address_note_label || "",
      alert: {
        title: config.emergency_alert_title || "",
        message: config.emergency_alert_message || "",
      },
      contacts: (() => {
        const contacts = [];
        let i = 1;
        while (config[`emergency_contact_${i}_name`]) {
          const contact = {
            type: config[`emergency_contact_${i}_type`] || "",
            name: config[`emergency_contact_${i}_name`],
            phone: config[`emergency_contact_${i}_phone`] || "",
          };
          if (config[`emergency_contact_${i}_address`]) contact.address = config[`emergency_contact_${i}_address`];
          if (config[`emergency_contact_${i}_hours`]) contact.hours = config[`emergency_contact_${i}_hours`];
          if (config[`emergency_contact_${i}_note`]) contact.note = config[`emergency_contact_${i}_note`];
          contacts.push(contact);
          i++;
        }
        return contacts;
      })(),
      safetyInfo: {
        title: config.emergency_safety_info_title || "",
        items: getNumberedSimpleItems(config, 'emergency_safety_item'),
      },
      addressNote: config.emergency_address_note || "",
      waterSafety: config.emergency_water_safety_title ? {
        title: config.emergency_water_safety_title,
        beaches: config.emergency_water_safety_beaches || "",
        freshwater: config.emergency_water_safety_freshwater || "",
      } : undefined,
    },
    sections: {
      welcome: config.section_welcome || "Welcome",
      propertyInfo: config.section_property_info || "Property Info",
      checkInOut: config.section_check_in_out || "Check In/Out",
      transport: config.section_transport || "Transport",
      houseRules: config.section_house_rules || "House Rules",
      amenities: config.section_amenities || "Amenities",
      localGuide: config.section_local_guide || "Local Guide",
      emergency: config.section_emergency || "Emergency",
    },
    common: {
      everythingYouNeed: config.common_everything_you_need || "Everything you need for a great stay",
      haveQuestions: config.common_have_questions || "Have questions? Contact us anytime at",
      or: config.common_or || "or",
    },
  };

  return guidebook;
}

fetchSheetData();
