// Google Sheets pull (and future push) helpers.
//
// Pull: reads each language sheet (key/value pairs), transforms to the
// guidebook structure, and writes JSON files to the locales dir.
import { google } from "googleapis";
import fs from "node:fs";
import path from "node:path";
import { writeLanguage, getSupportedLanguages } from "./locales.mjs";

function loadCredentials() {
  const credentialsPath = process.env.GOOGLE_SERVICE_ACCOUNT_PATH;
  const credentialsJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

  if (credentialsPath) {
    const fullPath = path.isAbsolute(credentialsPath)
      ? credentialsPath
      : path.resolve(credentialsPath);
    return JSON.parse(fs.readFileSync(fullPath, "utf8"));
  }
  if (credentialsJson) {
    const obj = JSON.parse(credentialsJson);
    if (obj.private_key) {
      obj.private_key = obj.private_key
        .replace(/\\\\n/g, "\n")
        .replace(/\\n/g, "\n");
    }
    return obj;
  }
  throw new Error(
    "Neither GOOGLE_SERVICE_ACCOUNT_PATH nor GOOGLE_SERVICE_ACCOUNT_KEY is set",
  );
}

function getSheetId() {
  const id = process.env.GOOGLE_SHEET_ID;
  if (!id) throw new Error("GOOGLE_SHEET_ID env var is not set");
  return id;
}

function getSheetsClient(scopes) {
  const auth = new google.auth.GoogleAuth({
    credentials: loadCredentials(),
    scopes,
  });
  return google.sheets({ version: "v4", auth });
}

export async function pullSheetsToLocales({ languages, log = () => {} } = {}) {
  const langs = languages?.length ? languages : getSupportedLanguages();
  const sheets = getSheetsClient([
    "https://www.googleapis.com/auth/spreadsheets.readonly",
  ]);
  const spreadsheetId = getSheetId();
  const results = [];

  for (const lang of langs) {
    log(`Fetching ${lang}...`);
    const resp = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${lang}!A1:B1000`,
    });
    const rows = resp.data.values;
    if (!rows || rows.length < 2) {
      log(`  ⚠ ${lang} empty, skipping`);
      results.push({ lang, ok: false, reason: "empty" });
      continue;
    }
    const config = {};
    rows.slice(1).forEach((row) => {
      if (row[0]) config[row[0]] = row[1] || "";
    });
    const guidebook = transformToGuidebookFormat(config, lang);
    await writeLanguage(lang, guidebook);
    log(`  ✓ ${lang}: ${rows.length - 1} rows`);
    results.push({ lang, ok: true, rows: rows.length - 1 });
  }
  return results;
}

// Helper: numbered list of objects (e.g. welcome_feature_1_icon).
function getNumberedItems(config, prefix, properties) {
  const items = [];
  let i = 1;
  while (config[`${prefix}_${i}_${properties[0]}`] !== undefined) {
    const item = {};
    properties.forEach((prop) => {
      const value = config[`${prefix}_${i}_${prop}`];
      if (value !== undefined && value !== "") item[prop] = value;
    });
    items.push(item);
    i++;
  }
  return items;
}

function getNumberedSimpleItems(config, prefix) {
  const items = [];
  let i = 1;
  while (config[`${prefix}_${i}`] !== undefined) {
    items.push(config[`${prefix}_${i}`]);
    i++;
  }
  return items;
}

export function transformToGuidebookFormat(config, language = "en") {
  // Convert newlines to <br> in string values.
  Object.keys(config).forEach((key) => {
    if (typeof config[key] === "string") {
      config[key] = config[key].replace(/\\n/g, "<br>").replace(/\n/g, "<br>");
    }
  });

  const featureProperties =
    language === "en" ? ["icon", "text", "link"] : ["icon", "text"];

  return {
    welcome: {
      introMessages: [
        config.welcome_intro_message_1 || "",
        config.welcome_intro_message_2 || "",
      ],
      featuresSection: {
        title: config.welcome_features_title || "",
        answer: config.welcome_features_answer || "",
        description: config.welcome_features_description || "",
        features: getNumberedItems(
          config,
          "welcome_feature",
          featureProperties,
        ),
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
      info_title: config.property_info_title || "",
      info_description: config.property_info_description || "",
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
        steps: getNumberedSimpleItems(config, "checkin_step"),
      },
      checkOut: {
        title: config.checkout_title || "",
        subheading: config.checkout_subheading || "",
        steps: getNumberedSimpleItems(config, "checkout_step"),
      },
      tip: config.checkinout_tip || "",
    },
    transport: {
      sectionTitle: config.transport_section_title || "",
      faresLabel: config.transport_fares_label || "",
      pleaseNoteLabel: config.transport_please_note_label || "",
      parking: config.transport_parking_title
        ? {
            title: config.transport_parking_title,
            description: config.transport_parking_description || "",
          }
        : undefined,
      rideshare: config.transport_rideshare_title
        ? {
            title: config.transport_rideshare_title,
            description: config.transport_rideshare_description || "",
          }
        : undefined,
      publicTransport: config.transport_public_title
        ? {
            title: config.transport_public_title,
            description: config.transport_public_description || "",
            info: config.transport_public_info || "",
            fares: config.transport_public_fares || "",
            limitations: config.transport_public_limitations,
          }
        : undefined,
      airportTransfers: config.transport_airport_title
        ? {
            title: config.transport_airport_title,
            description: config.transport_airport_description || "",
            options: getNumberedItems(config, "transport_airport_option", [
              "name",
              "phone",
              "type",
            ]),
            note: config.transport_airport_note,
          }
        : undefined,
      carRental: config.transport_car_rental_title
        ? {
            title: config.transport_car_rental_title,
            description: config.transport_car_rental_description || "",
            note: config.transport_car_rental_note,
          }
        : undefined,
    },
    houseRules: {
      rules: getNumberedItems(config, "house_rule", [
        "icon",
        "title",
        "description",
      ]),
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
        if (config[`amenity_${i}_instructions`])
          amenity.instructions = config[`amenity_${i}_instructions`];
        if (config[`amenity_${i}_service_info`])
          amenity.serviceInfo = config[`amenity_${i}_service_info`];
        if (config[`amenity_${i}_items`])
          amenity.items = config[`amenity_${i}_items`].split(" | ");
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
          if (config[`local_rec_${i}_address`])
            rec.address = config[`local_rec_${i}_address`];
          if (config[`local_rec_${i}_distance`])
            rec.distance = config[`local_rec_${i}_distance`];
          if (config[`local_rec_${i}_link`])
            rec.link = config[`local_rec_${i}_link`];
          if (config[`local_rec_${i}_note`])
            rec.note = config[`local_rec_${i}_note`];
          recs.push(rec);
          i++;
        }
        return recs;
      })(),
      tip: config.local_guide_tip || "",
      packingList: config.local_guide_packing_list_title
        ? {
            title: config.local_guide_packing_list_title,
            items: getNumberedSimpleItems(config, "local_guide_packing_item"),
          }
        : undefined,
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
          if (config[`emergency_contact_${i}_address`])
            contact.address = config[`emergency_contact_${i}_address`];
          if (config[`emergency_contact_${i}_hours`])
            contact.hours = config[`emergency_contact_${i}_hours`];
          if (config[`emergency_contact_${i}_note`])
            contact.note = config[`emergency_contact_${i}_note`];
          contacts.push(contact);
          i++;
        }
        return contacts;
      })(),
      safetyInfo: {
        title: config.emergency_safety_info_title || "",
        items: getNumberedSimpleItems(config, "emergency_safety_item"),
      },
      addressNote: config.emergency_address_note || "",
      waterSafety: config.emergency_water_safety_title
        ? {
            title: config.emergency_water_safety_title,
            beaches: config.emergency_water_safety_beaches || "",
            freshwater: config.emergency_water_safety_freshwater || "",
          }
        : undefined,
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
      everythingYouNeed:
        config.common_everything_you_need ||
        "Everything you need for a great stay",
      haveQuestions:
        config.common_have_questions || "Have questions? Contact us anytime at",
      or: config.common_or || "or",
    },
  };
}
