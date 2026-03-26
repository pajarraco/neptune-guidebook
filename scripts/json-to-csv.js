#!/usr/bin/env node

/**
 * JSON to CSV Converter
 * Flattens all guidebook-data.json into a complete CSV with all arrays expanded
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(__dirname, '../src/assets/guidebook-data.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

const rows = [['key', 'value']];

// Helper to escape CSV values
function escapeCSV(value) {
  if (value === undefined || value === null) return '';
  const str = String(value);
  // Escape quotes and wrap in quotes if contains comma, newline, or quote
  if (str.includes(',') || str.includes('\n') || str.includes('"')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

// Welcome intro messages
data.welcome.introMessages.forEach((msg, i) => {
  rows.push([`welcome_intro_message_${i + 1}`, escapeCSV(msg)]);
});

// Welcome features section
rows.push(['welcome_features_title', escapeCSV(data.welcome.featuresSection.title)]);
rows.push(['welcome_features_answer', escapeCSV(data.welcome.featuresSection.answer)]);
rows.push(['welcome_features_description', escapeCSV(data.welcome.featuresSection.description)]);
data.welcome.featuresSection.features.forEach((f, i) => {
  rows.push([`welcome_feature_${i + 1}_icon`, escapeCSV(f.icon)]);
  rows.push([`welcome_feature_${i + 1}_text`, escapeCSV(f.text)]);
  rows.push([`welcome_feature_${i + 1}_link`, escapeCSV(f.link || '')]);
});
rows.push(['welcome_features_note', escapeCSV(data.welcome.featuresSection.note)]);

// Add to phone
rows.push(['welcome_add_to_phone_icon', escapeCSV(data.welcome.addToPhone.icon)]);
rows.push(['welcome_add_to_phone_title', escapeCSV(data.welcome.addToPhone.title)]);
data.welcome.addToPhone.messages.forEach((msg, i) => {
  rows.push([`welcome_add_to_phone_message_${i + 1}`, escapeCSV(msg)]);
});

// Meet your team
rows.push(['welcome_meet_team_title', escapeCSV(data.welcome.meetYourTeam.title)]);
rows.push(['welcome_meet_team_photo', escapeCSV(data.welcome.meetYourTeam.photoPlaceholder)]);
rows.push(['welcome_host_icon', escapeCSV(data.welcome.meetYourTeam.hostWelcome.icon)]);
rows.push(['welcome_host_title', escapeCSV(data.welcome.meetYourTeam.hostWelcome.title)]);
rows.push(['welcome_host_description', escapeCSV(data.welcome.meetYourTeam.hostWelcome.description)]);
rows.push(['welcome_host_team_intro', escapeCSV(data.welcome.meetYourTeam.hostWelcome.teamIntro)]);
data.welcome.meetYourTeam.hostWelcome.teamMembers.forEach((m, i) => {
  rows.push([`welcome_team_member_${i + 1}_icon`, escapeCSV(m.icon)]);
  rows.push([`welcome_team_member_${i + 1}_text`, escapeCSV(m.text)]);
});

// Founder note
rows.push(['welcome_founder_icon', escapeCSV(data.welcome.meetYourTeam.founderNote.icon)]);
rows.push(['welcome_founder_title', escapeCSV(data.welcome.meetYourTeam.founderNote.title)]);
rows.push(['welcome_founder_message', escapeCSV(data.welcome.meetYourTeam.founderNote.message)]);
rows.push(['welcome_founder_mission', escapeCSV(data.welcome.meetYourTeam.founderNote.mission)]);
rows.push(['welcome_founder_closing', escapeCSV(data.welcome.meetYourTeam.founderNote.closing)]);

// Property info
rows.push(['property_name', escapeCSV(data.propertyInfo.name)]);
rows.push(['property_address', escapeCSV(data.propertyInfo.address)]);
rows.push(['property_address_title', escapeCSV(data.propertyInfo.addressTitle)]);
rows.push(['property_wifi_title', escapeCSV(data.propertyInfo.wifi.title)]);
rows.push(['property_wifi_network_label', escapeCSV(data.propertyInfo.wifi.networkLabel)]);
rows.push(['property_wifi_password_label', escapeCSV(data.propertyInfo.wifi.passwordLabel)]);
rows.push(['property_wifi_network', escapeCSV(data.propertyInfo.wifi.network)]);
rows.push(['property_wifi_password', escapeCSV(data.propertyInfo.wifi.password)]);
rows.push(['property_checkin_time', escapeCSV(data.propertyInfo.checkIn)]);
rows.push(['property_checkin_label', escapeCSV(data.propertyInfo.checkInLabel)]);
rows.push(['property_checkout_time', escapeCSV(data.propertyInfo.checkOut)]);
rows.push(['property_checkout_label', escapeCSV(data.propertyInfo.checkOutLabel)]);
rows.push(['property_email', escapeCSV(data.propertyInfo.email)]);
rows.push(['property_phone', escapeCSV(data.propertyInfo.phone)]);
rows.push(['property_phone_label', escapeCSV(data.propertyInfo.phoneLabel)]);

// Check in/out
rows.push(['checkinout_section_title', escapeCSV(data.checkInOut.sectionTitle)]);
rows.push(['checkin_title', escapeCSV(data.checkInOut.checkIn.title)]);
rows.push(['checkin_subheading', escapeCSV(data.checkInOut.checkIn.subheading)]);
rows.push(['checkin_arriving_early_label', escapeCSV(data.checkInOut.checkIn.arrivingEarlyLabel)]);
data.checkInOut.checkIn.steps.forEach((step, i) => {
  rows.push([`checkin_step_${i + 1}`, escapeCSV(step)]);
});
rows.push(['checkout_title', escapeCSV(data.checkInOut.checkOut.title)]);
rows.push(['checkout_subheading', escapeCSV(data.checkInOut.checkOut.subheading)]);
data.checkInOut.checkOut.steps.forEach((step, i) => {
  rows.push([`checkout_step_${i + 1}`, escapeCSV(step)]);
});
rows.push(['checkinout_tip', escapeCSV(data.checkInOut.tip)]);

// Transport
rows.push(['transport_section_title', escapeCSV(data.transport.sectionTitle)]);
rows.push(['transport_fares_label', escapeCSV(data.transport.faresLabel)]);
rows.push(['transport_please_note_label', escapeCSV(data.transport.pleaseNoteLabel)]);

// Amenities
rows.push(['amenities_section_title', escapeCSV(data.amenitiesSection.sectionTitle)]);
rows.push(['amenities_service_info_label', escapeCSV(data.amenitiesSection.serviceInfoLabel)]);
rows.push(['amenities_how_to_use_label', escapeCSV(data.amenitiesSection.howToUseLabel)]);
rows.push(['amenities_help_tip_title', escapeCSV(data.amenitiesSection.helpTip.title)]);
rows.push(['amenities_help_tip_message', escapeCSV(data.amenitiesSection.helpTip.message)]);

// Local guide
rows.push(['localguide_section_title', escapeCSV(data.localGuide.sectionTitle)]);
rows.push(['localguide_view_on_maps_label', escapeCSV(data.localGuide.viewOnMapsLabel)]);
rows.push(['localguide_packing_list_intro', escapeCSV(data.localGuide.packingListIntro)]);

// Emergency
rows.push(['emergency_section_title', escapeCSV(data.emergency.sectionTitle)]);
rows.push(['emergency_beaches_label', escapeCSV(data.emergency.beachesLabel)]);
rows.push(['emergency_freshwater_label', escapeCSV(data.emergency.freshwaterLabel)]);
rows.push(['emergency_address_note_label', escapeCSV(data.emergency.addressNoteLabel)]);
rows.push(['emergency_alert_title', escapeCSV(data.emergency.alert.title)]);
rows.push(['emergency_alert_message', escapeCSV(data.emergency.alert.message)]);
rows.push(['emergency_safety_info_title', escapeCSV(data.emergency.safetyInfo.title)]);
data.emergency.safetyInfo.items.forEach((item, i) => {
  rows.push([`emergency_safety_item_${i + 1}`, escapeCSV(item)]);
});
rows.push(['emergency_address_note', escapeCSV(data.emergency.addressNote)]);
if (data.emergency.waterSafety) {
  rows.push(['emergency_water_safety_title', escapeCSV(data.emergency.waterSafety.title)]);
  rows.push(['emergency_water_safety_beaches', escapeCSV(data.emergency.waterSafety.beaches)]);
  rows.push(['emergency_water_safety_freshwater', escapeCSV(data.emergency.waterSafety.freshwater)]);
}

// Emergency Contacts
data.emergency.contacts.forEach((contact, i) => {
  rows.push([`emergency_contact_${i + 1}_type`, escapeCSV(contact.type)]);
  rows.push([`emergency_contact_${i + 1}_name`, escapeCSV(contact.name)]);
  rows.push([`emergency_contact_${i + 1}_phone`, escapeCSV(contact.phone)]);
  if (contact.address) rows.push([`emergency_contact_${i + 1}_address`, escapeCSV(contact.address)]);
  if (contact.hours) rows.push([`emergency_contact_${i + 1}_hours`, escapeCSV(contact.hours)]);
  if (contact.note) rows.push([`emergency_contact_${i + 1}_note`, escapeCSV(contact.note)]);
});

// Transport - Parking
if (data.transport.parking) {
  rows.push(['transport_parking_title', escapeCSV(data.transport.parking.title)]);
  rows.push(['transport_parking_description', escapeCSV(data.transport.parking.description)]);
}

// Transport - Rideshare
if (data.transport.rideshare) {
  rows.push(['transport_rideshare_title', escapeCSV(data.transport.rideshare.title)]);
  rows.push(['transport_rideshare_description', escapeCSV(data.transport.rideshare.description)]);
}

// Transport - Public Transport
if (data.transport.publicTransport) {
  rows.push(['transport_public_title', escapeCSV(data.transport.publicTransport.title)]);
  rows.push(['transport_public_description', escapeCSV(data.transport.publicTransport.description)]);
  rows.push(['transport_public_info', escapeCSV(data.transport.publicTransport.info)]);
  rows.push(['transport_public_fares', escapeCSV(data.transport.publicTransport.fares)]);
  if (data.transport.publicTransport.limitations) {
    rows.push(['transport_public_limitations', escapeCSV(data.transport.publicTransport.limitations)]);
  }
}

// Transport - Airport Transfers
if (data.transport.airportTransfers) {
  rows.push(['transport_airport_title', escapeCSV(data.transport.airportTransfers.title)]);
  rows.push(['transport_airport_description', escapeCSV(data.transport.airportTransfers.description)]);
  data.transport.airportTransfers.options.forEach((option, i) => {
    rows.push([`transport_airport_option_${i + 1}_name`, escapeCSV(option.name)]);
    if (option.phone) rows.push([`transport_airport_option_${i + 1}_phone`, escapeCSV(option.phone)]);
    rows.push([`transport_airport_option_${i + 1}_type`, escapeCSV(option.type)]);
  });
  if (data.transport.airportTransfers.note) {
    rows.push(['transport_airport_note', escapeCSV(data.transport.airportTransfers.note)]);
  }
}

// Transport - Car Rental
if (data.transport.carRental) {
  rows.push(['transport_car_rental_title', escapeCSV(data.transport.carRental.title)]);
  rows.push(['transport_car_rental_description', escapeCSV(data.transport.carRental.description)]);
  if (data.transport.carRental.note) {
    rows.push(['transport_car_rental_note', escapeCSV(data.transport.carRental.note)]);
  }
}

// House Rules
rows.push(['house_rules_important_note_title', escapeCSV(data.houseRules.importantNote.title)]);
rows.push(['house_rules_important_note_message', escapeCSV(data.houseRules.importantNote.message)]);
data.houseRules.rules.forEach((rule, i) => {
  rows.push([`house_rule_${i + 1}_icon`, escapeCSV(rule.icon)]);
  rows.push([`house_rule_${i + 1}_title`, escapeCSV(rule.title)]);
  rows.push([`house_rule_${i + 1}_description`, escapeCSV(rule.description)]);
});

// Amenities
data.amenities.forEach((amenity, i) => {
  rows.push([`amenity_${i + 1}_name`, escapeCSV(amenity.name)]);
  rows.push([`amenity_${i + 1}_description`, escapeCSV(amenity.description)]);
  if (amenity.instructions) rows.push([`amenity_${i + 1}_instructions`, escapeCSV(amenity.instructions)]);
  if (amenity.serviceInfo) rows.push([`amenity_${i + 1}_service_info`, escapeCSV(amenity.serviceInfo)]);
  if (amenity.items && amenity.items.length > 0) {
    rows.push([`amenity_${i + 1}_items`, escapeCSV(amenity.items.join(' | '))]);
  }
});

// Local Guide
rows.push(['local_guide_tip', escapeCSV(data.localGuide.tip)]);
if (data.localGuide.packingList) {
  rows.push(['local_guide_packing_list_title', escapeCSV(data.localGuide.packingList.title)]);
  data.localGuide.packingList.items.forEach((item, i) => {
    rows.push([`local_guide_packing_item_${i + 1}`, escapeCSV(item)]);
  });
}

// Local Recommendations
data.localGuide.recommendations.forEach((rec, i) => {
  rows.push([`local_rec_${i + 1}_category`, escapeCSV(rec.category)]);
  rows.push([`local_rec_${i + 1}_name`, escapeCSV(rec.name)]);
  rows.push([`local_rec_${i + 1}_description`, escapeCSV(rec.description)]);
  if (rec.address) rows.push([`local_rec_${i + 1}_address`, escapeCSV(rec.address)]);
  if (rec.distance) rows.push([`local_rec_${i + 1}_distance`, escapeCSV(rec.distance)]);
  if (rec.link) rows.push([`local_rec_${i + 1}_link`, escapeCSV(rec.link)]);
  if (rec.note) rows.push([`local_rec_${i + 1}_note`, escapeCSV(rec.note)]);
});

// Convert to CSV
const csv = rows.map(row => row.join(',')).join('\n');

const outputPath = path.join(__dirname, '../config.csv');
fs.writeFileSync(outputPath, csv);

console.log(`✅ Created complete config.csv with ${rows.length - 1} rows`);
console.log(`📝 Output: ${outputPath}`);
console.log(`\n📊 Data included:`);
console.log(`   - Welcome features: ${data.welcome.featuresSection.features.length}`);
console.log(`   - Team members: ${data.welcome.meetYourTeam.hostWelcome.teamMembers.length}`);
console.log(`   - Check-in steps: ${data.checkInOut.checkIn.steps.length}`);
console.log(`   - Check-out steps: ${data.checkInOut.checkOut.steps.length}`);
console.log(`   - House rules: ${data.houseRules.rules.length}`);
console.log(`   - Amenities: ${data.amenities.length}`);
console.log(`   - Local recommendations: ${data.localGuide.recommendations.length}`);
console.log(`   - Emergency contacts: ${data.emergency.contacts.length}`);
