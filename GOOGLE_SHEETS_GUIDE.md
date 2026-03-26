# Google Sheets Integration Guide

## Recommended Approach

For Google Sheets compatibility, we'll use a **hybrid approach**:

### ✅ Keep as-is (already Sheets-friendly):
- Simple key-value pairs
- Small nested objects (1-2 levels)
- Property info, labels, titles

### 🔄 Flatten these (convert arrays to numbered properties):
- **Welcome features** (4 items) → `feature_1_icon`, `feature_1_text`, `feature_1_link`, etc.
- **Team members** (5 items) → `team_member_1_icon`, `team_member_1_text`, etc.
- **Check-in steps** (5 items) → `checkin_step_1`, `checkin_step_2`, etc.
- **Check-out steps** (5 items) → `checkout_step_1`, `checkout_step_2`, etc.
- **Intro messages** (2 items) → `intro_message_1`, `intro_message_2`
- **Add to phone messages** (2 items) → `add_to_phone_message_1`, `add_to_phone_message_2`

### 📊 Keep in separate sheets/files (too large/variable):
- Amenities (4+ items, variable)
- Local recommendations (12+ items, variable)
- Emergency contacts (6+ items, variable)
- House rules (6+ items, variable)
- Transport options (5+ sections, variable)

## How to Export to Google Sheets

1. **Main Config Sheet**: All flattened key-value pairs
   - Column A: Key (e.g., `welcome_feature_1_icon`)
   - Column B: Value (e.g., `wifi`)

2. **Amenities Sheet**: Separate CSV for amenities
3. **Recommendations Sheet**: Separate CSV for local guide
4. **Contacts Sheet**: Separate CSV for emergency contacts

## Benefits

- ✅ Easy to edit common text in Google Sheets
- ✅ No complex nested structures
- ✅ Predictable, numbered fields
- ✅ Can use VLOOKUP, formulas
- ✅ Simple import/export scripts
