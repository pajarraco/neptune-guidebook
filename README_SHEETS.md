# Google Sheets Workflow

## Quick Start

### 1. Export Current Data to CSV
```bash
node scripts/json-to-csv.js
```
This creates `config.csv` with **ALL** editable content (289 rows).

### 2. Import to Google Sheets
1. Open Google Sheets
2. Create new spreadsheet: "Neptune Guidebook Data"
3. File → Import → Upload `config.csv`
4. Import location: "Replace current sheet"
5. Rename sheet to "Config"

### 3. Set Up Google Cloud (One-time)
Follow the detailed setup in `GOOGLE_SHEETS_SETUP.md`:
- Enable Google Sheets API
- Create service account
- Download credentials JSON
- Share your sheet with the service account email

### 4. Configure Environment
Create `.env.local`:
```env
GOOGLE_SHEET_ID=your_spreadsheet_id_here
GOOGLE_SERVICE_ACCOUNT_PATH=./service-account.json
```

### 5. Sync from Google Sheets
After editing content in Google Sheets:
```bash
node scripts/fetch-sheet-data.js
```

### 6. View Changes
```bash
npm run dev
```

## What Can You Edit?

**ALL 289 rows in the Config sheet are editable - 100% of your guidebook content!**

### Welcome Section (40 rows)
- `welcome_intro_message_1` / `_2` - Opening messages
- `welcome_features_title` / `_answer` / `_description` / `_note` - Features section text
- `welcome_feature_1_icon` / `_text` / `_link` - Feature 1 (repeat for 2-4)
- `welcome_add_to_phone_icon` / `_title` / `_message_1` / `_message_2` - Add to phone section
- `welcome_meet_team_title` / `_photo` - Team section header
- `welcome_host_icon` / `_title` / `_description` / `_team_intro` - Host welcome
- `welcome_team_member_1_icon` / `_text` - Team member 1 (repeat for 2-5)
- `welcome_founder_icon` / `_title` / `_message` / `_mission` / `_closing` - Founder note

### Property Info (15 rows)
- `property_name` / `_address` / `_address_title`
- `property_wifi_title` / `_network_label` / `_password_label` / `_network` / `_password`
- `property_checkin_time` / `_label`
- `property_checkout_time` / `_label`
- `property_email` / `_phone` / `_phone_label`

### Check-In/Out (15 rows)
- `checkinout_section_title`
- `checkin_title` / `_subheading` / `_arriving_early_label`
- `checkin_step_1` through `checkin_step_5`
- `checkout_title` / `_subheading`
- `checkout_step_1` through `checkout_step_5`
- `checkinout_tip`

### Section Labels (12 rows)
- `transport_section_title` / `_fares_label` / `_please_note_label`
- `amenities_section_title` / `_service_info_label` / `_how_to_use_label` / `_help_tip_title` / `_help_tip_message`
- `localguide_section_title` / `_view_on_maps_label` / `_packing_list_intro`
- `emergency_section_title` / `_beaches_label` / `_freshwater_label` / `_address_note_label`

### Transport Options (~20 rows)
- **Parking**: `transport_parking_title` / `_description`
- **Rideshare**: `transport_rideshare_title` / `_description`
- **Public Transport**: `transport_public_title` / `_description` / `_info` / `_fares` / `_limitations`
- **Airport Transfers**: `transport_airport_title` / `_description` / `_note`
  - Options: `transport_airport_option_1_name` / `_phone` / `_type` (repeat for 2)
- **Car Rental**: `transport_car_rental_title` / `_description` / `_note`

### House Rules (~26 rows)
- Important note: `house_rules_important_note_title` / `_message`
- Rules (8 items): `house_rule_1_icon` / `_title` / `_description` (repeat for 2-8)

### Amenities (~30 rows)
- 7 amenities: `amenity_1_name` / `_description` / `_instructions` / `_service_info` / `_items` (repeat for 2-7)

### Local Guide (~120 rows)
- Tip: `local_guide_tip`
- Packing list: `local_guide_packing_list_title`
  - Items: `local_guide_packing_item_1` through `_6`
- Recommendations (17 items): `local_rec_1_category` / `_name` / `_description` / `_address` / `_distance` / `_link` / `_note` (repeat for 2-17)

### Emergency (~40 rows)
- Alert: `emergency_alert_title` / `_message`
- Safety info: `emergency_safety_info_title`
  - Items: `emergency_safety_item_1` through `_5`
- Water safety: `emergency_water_safety_title` / `_beaches` / `_freshwater`
- Address note: `emergency_address_note`
- Contacts (7 items): `emergency_contact_1_type` / `_name` / `_phone` / `_address` / `_hours` / `_note` (repeat for 2-7)

## Important Notes

⚠️ **Do NOT change column A** (keys) - only edit column B (values)

⚠️ **Preserve placeholders:**
- `{{APARTMENT_NUMBER}}` in addresses
- `{{CODE}}` in check-in steps
- `<strong>` HTML tags

⚠️ **Multi-line text:**
- Use `\n` for line breaks in founder message/mission

⚠️ **Empty values:**
- Leave blank for optional fields (e.g., `welcome_feature_4_link`)

## Workflow

```
Edit in Google Sheets
        ↓
node scripts/fetch-sheet-data.js
        ↓
Updates guidebook-data.json
        ↓
npm run dev (to see changes)
```

## Troubleshooting

**Script fails:**
- Check `.env.local` has correct `GOOGLE_SHEET_ID`
- Verify service account has access to the sheet
- Ensure sheet is named exactly "Config"

**Changes don't appear:**
- Run the fetch script after editing
- Restart dev server
- Check browser console for errors

**Data looks wrong:**
- Don't modify the keys (column A)
- Check for proper CSV escaping of quotes
- Verify numbered items are sequential (1, 2, 3...)
