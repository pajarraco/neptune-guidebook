// Google Sheets pull (and future push) helpers.
//
// Pull: reads each language sheet (key/value pairs), transforms to the
// guidebook structure, and writes JSON files to the locales dir.
import { google } from "googleapis";
import fs from "node:fs";
import path from "node:path";
import { writeLanguage, readLanguage, getSupportedLanguages } from "./locales.mjs";

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

// Inverse transform: guidebook format → flat key/value pairs for Google Sheets
export function transformFromGuidebookFormat(guidebook) {
  const config = {};

  // Helper to set value if present, converting <br> back to \n
  const set = (key, value) => {
    if (value !== undefined && value !== null && value !== "") {
      config[key] = typeof value === "string"
        ? value.replace(/<br>/g, "\n")
        : value;
    }
  };

  // Helper for numbered items
  const setNumbered = (prefix, items, properties) => {
    items.forEach((item, i) => {
      const idx = i + 1;
      properties.forEach((prop) => {
        set(`${prefix}_${idx}_${prop}`, item[prop]);
      });
    });
  };

  const setNumberedSimple = (prefix, items) => {
    items.forEach((item, i) => {
      set(`${prefix}_${i + 1}`, item);
    });
  };

  const g = guidebook;

  // Welcome
  if (g.welcome) {
    set("welcome_intro_message_1", g.welcome.introMessages?.[0]);
    set("welcome_intro_message_2", g.welcome.introMessages?.[1]);

    if (g.welcome.featuresSection) {
      set("welcome_features_title", g.welcome.featuresSection.title);
      set("welcome_features_answer", g.welcome.featuresSection.answer);
      set("welcome_features_description", g.welcome.featuresSection.description);
      setNumbered("welcome_feature", g.welcome.featuresSection.features || [], ["icon", "text", "link"]);
      set("welcome_features_note", g.welcome.featuresSection.note);
    }

    if (g.welcome.addToPhone) {
      set("welcome_add_to_phone_icon", g.welcome.addToPhone.icon);
      set("welcome_add_to_phone_title", g.welcome.addToPhone.title);
      set("welcome_add_to_phone_message_1", g.welcome.addToPhone.messages?.[0]);
      set("welcome_add_to_phone_message_2", g.welcome.addToPhone.messages?.[1]);
    }

    if (g.welcome.meetYourTeam) {
      set("welcome_meet_team_title", g.welcome.meetYourTeam.title);
      set("welcome_meet_team_photo", g.welcome.meetYourTeam.photoPlaceholder);

      if (g.welcome.meetYourTeam.hostWelcome) {
        set("welcome_host_icon", g.welcome.meetYourTeam.hostWelcome.icon);
        set("welcome_host_title", g.welcome.meetYourTeam.hostWelcome.title);
        set("welcome_host_description", g.welcome.meetYourTeam.hostWelcome.description);
        set("welcome_host_team_intro", g.welcome.meetYourTeam.hostWelcome.teamIntro);
      }

      if (g.welcome.meetYourTeam.founderNote) {
        set("welcome_founder_icon", g.welcome.meetYourTeam.founderNote.icon);
        set("welcome_founder_title", g.welcome.meetYourTeam.founderNote.title);
        set("welcome_founder_message", g.welcome.meetYourTeam.founderNote.message);
        set("welcome_founder_mission", g.welcome.meetYourTeam.founderNote.mission);
        set("welcome_founder_closing", g.welcome.meetYourTeam.founderNote.closing);
      }
    }
  }

  // Property Info
  if (g.propertyInfo) {
    set("property_name", g.propertyInfo.name);
    set("property_address", g.propertyInfo.address);
    set("property_info_title", g.propertyInfo.info_title);
    set("property_info_description", g.propertyInfo.info_description);

    if (g.propertyInfo.wifi) {
      set("property_wifi_network", g.propertyInfo.wifi.network);
      set("property_wifi_password", g.propertyInfo.wifi.password);
      set("property_wifi_title", g.propertyInfo.wifi.title);
      set("property_wifi_network_label", g.propertyInfo.wifi.networkLabel);
      set("property_wifi_password_label", g.propertyInfo.wifi.passwordLabel);
    }

    set("property_checkin_time", g.propertyInfo.checkIn);
    set("property_checkin_label", g.propertyInfo.checkInLabel);
    set("property_checkout_time", g.propertyInfo.checkOut);
    set("property_checkout_label", g.propertyInfo.checkOutLabel);
    set("property_email", g.propertyInfo.email);
    set("property_phone", g.propertyInfo.phone);
    set("property_phone_label", g.propertyInfo.phoneLabel);
  }

  // Check In/Out
  if (g.checkInOut) {
    set("checkinout_section_title", g.checkInOut.sectionTitle);

    if (g.checkInOut.checkIn) {
      set("checkin_title", g.checkInOut.checkIn.title);
      set("checkin_subheading", g.checkInOut.checkIn.subheading);
      set("checkin_arriving_early_label", g.checkInOut.checkIn.arrivingEarlyLabel);
      setNumberedSimple("checkin_step", g.checkInOut.checkIn.steps || []);
    }

    if (g.checkInOut.checkOut) {
      set("checkout_title", g.checkInOut.checkOut.title);
      set("checkout_subheading", g.checkInOut.checkOut.subheading);
      setNumberedSimple("checkout_step", g.checkInOut.checkOut.steps || []);
    }

    set("checkinout_tip", g.checkInOut.tip);
  }

  // Transport
  if (g.transport) {
    set("transport_section_title", g.transport.sectionTitle);
    set("transport_fares_label", g.transport.faresLabel);
    set("transport_please_note_label", g.transport.pleaseNoteLabel);

    if (g.transport.parking) {
      set("transport_parking_title", g.transport.parking.title);
      set("transport_parking_description", g.transport.parking.description);
    }

    if (g.transport.rideshare) {
      set("transport_rideshare_title", g.transport.rideshare.title);
      set("transport_rideshare_description", g.transport.rideshare.description);
    }

    if (g.transport.publicTransport) {
      set("transport_public_title", g.transport.publicTransport.title);
      set("transport_public_description", g.transport.publicTransport.description);
      set("transport_public_info", g.transport.publicTransport.info);
      set("transport_public_fares", g.transport.publicTransport.fares);
      set("transport_public_limitations", g.transport.publicTransport.limitations);
    }

    if (g.transport.airportTransfers) {
      set("transport_airport_title", g.transport.airportTransfers.title);
      set("transport_airport_description", g.transport.airportTransfers.description);
      setNumbered("transport_airport_option", g.transport.airportTransfers.options || [], ["name", "phone", "type"]);
      set("transport_airport_note", g.transport.airportTransfers.note);
    }

    if (g.transport.carRental) {
      set("transport_car_rental_title", g.transport.carRental.title);
      set("transport_car_rental_description", g.transport.carRental.description);
      set("transport_car_rental_note", g.transport.carRental.note);
    }
  }

  // House Rules
  if (g.houseRules) {
    setNumbered("house_rule", g.houseRules.rules || [], ["icon", "title", "description"]);

    if (g.houseRules.importantNote) {
      set("house_rules_important_note_title", g.houseRules.importantNote.title);
      set("house_rules_important_note_message", g.houseRules.importantNote.message);
    }
  }

  // Amenities Section
  if (g.amenitiesSection) {
    set("amenities_section_title", g.amenitiesSection.sectionTitle);
    set("amenities_service_info_label", g.amenitiesSection.serviceInfoLabel);
    set("amenities_how_to_use_label", g.amenitiesSection.howToUseLabel);

    if (g.amenitiesSection.helpTip) {
      set("amenities_help_tip_title", g.amenitiesSection.helpTip.title);
      set("amenities_help_tip_message", g.amenitiesSection.helpTip.message);
    }
  }

  // Amenities
  if (g.amenities) {
    g.amenities.forEach((amenity, i) => {
      const idx = i + 1;
      set(`amenity_${idx}_name`, amenity.name);
      set(`amenity_${idx}_description`, amenity.description);
      set(`amenity_${idx}_instructions`, amenity.instructions);
      set(`amenity_${idx}_service_info`, amenity.serviceInfo);
      if (amenity.items) {
        set(`amenity_${idx}_items`, amenity.items.join(" | "));
      }
    });
  }

  // Local Guide
  if (g.localGuide) {
    set("localguide_section_title", g.localGuide.sectionTitle);
    set("localguide_view_on_maps_label", g.localGuide.viewOnMapsLabel);
    set("localguide_packing_list_intro", g.localGuide.packingListIntro);

    if (g.localGuide.recommendations) {
      g.localGuide.recommendations.forEach((rec, i) => {
        const idx = i + 1;
        set(`local_rec_${idx}_category`, rec.category);
        set(`local_rec_${idx}_name`, rec.name);
        set(`local_rec_${idx}_description`, rec.description);
        set(`local_rec_${idx}_address`, rec.address);
        set(`local_rec_${idx}_distance`, rec.distance);
        set(`local_rec_${idx}_link`, rec.link);
        set(`local_rec_${idx}_note`, rec.note);
      });
    }

    set("local_guide_tip", g.localGuide.tip);

    if (g.localGuide.packingList) {
      set("local_guide_packing_list_title", g.localGuide.packingList.title);
      setNumberedSimple("local_guide_packing_item", g.localGuide.packingList.items || []);
    }
  }

  // Emergency
  if (g.emergency) {
    set("emergency_section_title", g.emergency.sectionTitle);
    set("emergency_beaches_label", g.emergency.beachesLabel);
    set("emergency_freshwater_label", g.emergency.freshwaterLabel);
    set("emergency_address_note_label", g.emergency.addressNoteLabel);

    if (g.emergency.alert) {
      set("emergency_alert_title", g.emergency.alert.title);
      set("emergency_alert_message", g.emergency.alert.message);
    }

    if (g.emergency.contacts) {
      g.emergency.contacts.forEach((contact, i) => {
        const idx = i + 1;
        set(`emergency_contact_${idx}_type`, contact.type);
        set(`emergency_contact_${idx}_name`, contact.name);
        set(`emergency_contact_${idx}_phone`, contact.phone);
        set(`emergency_contact_${idx}_address`, contact.address);
        set(`emergency_contact_${idx}_hours`, contact.hours);
        set(`emergency_contact_${idx}_note`, contact.note);
      });
    }

    if (g.emergency.safetyInfo) {
      set("emergency_safety_info_title", g.emergency.safetyInfo.title);
      setNumberedSimple("emergency_safety_item", g.emergency.safetyInfo.items || []);
    }

    set("emergency_address_note", g.emergency.addressNote);

    if (g.emergency.waterSafety) {
      set("emergency_water_safety_title", g.emergency.waterSafety.title);
      set("emergency_water_safety_beaches", g.emergency.waterSafety.beaches);
      set("emergency_water_safety_freshwater", g.emergency.waterSafety.freshwater);
    }
  }

  // Sections
  if (g.sections) {
    set("section_welcome", g.sections.welcome);
    set("section_property_info", g.sections.propertyInfo);
    set("section_check_in_out", g.sections.checkInOut);
    set("section_transport", g.sections.transport);
    set("section_house_rules", g.sections.houseRules);
    set("section_amenities", g.sections.amenities);
    set("section_local_guide", g.sections.localGuide);
    set("section_emergency", g.sections.emergency);
  }

  // Common
  if (g.common) {
    set("common_everything_you_need", g.common.everythingYouNeed);
    set("common_have_questions", g.common.haveQuestions);
    set("common_or", g.common.or);
  }

  return config;
}

// Push locale JSON files to Google Sheets
export async function pushLocalesToSheets({ languages, log = () => {} } = {}) {
  // Default to English only for push (English is the source of truth)
  const langs = languages?.length ? languages : ["en"];
  const sheets = getSheetsClient([
    "https://www.googleapis.com/auth/spreadsheets",
  ]);
  const spreadsheetId = getSheetId();
  const results = [];

  for (const lang of langs) {
    log(`Pushing ${lang}...`);
    try {
      const guidebook = await readLanguage(lang);
      const config = transformFromGuidebookFormat(guidebook);

      // Convert to rows: [['key', 'value'], ...]
      const rows = Object.entries(config).map(([key, value]) => [key, value || ""]);
      rows.sort((a, b) => a[0].localeCompare(b[0])); // Sort by key

      // Clear the sheet and write new data
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${lang}!A1:B`,
        valueInputOption: "RAW",
        requestBody: {
          values: [["key", "value"], ...rows],
        },
      });

      log(`  ✓ ${lang}: ${rows.length} rows pushed`);
      results.push({ lang, ok: true, rows: rows.length });
    } catch (e) {
      log(`  ✗ ${lang}: ${e.message}`);
      results.push({ lang, ok: false, reason: e.message });
    }
  }
  return results;
}
