# Google Sheets Structure for Guidebook Data

## Overview
To make the data Google Sheets-friendly, we'll split it into multiple sheets:

### Sheet 1: Config (Key-Value pairs)
Simple configuration values in two columns: `key` | `value`

### Sheet 2: Welcome Features (4 rows)
Columns: `order` | `icon` | `text` | `link`

### Sheet 3: Team Members (5 rows)
Columns: `order` | `icon` | `text`

### Sheet 4: Check-in Steps (5 rows)
Columns: `order` | `step_text`

### Sheet 5: Check-out Steps (5 rows)
Columns: `order` | `step_text`

### Sheet 6: House Rules (6 rows)
Columns: `order` | `icon` | `title` | `description`

### Sheet 7: Amenities (4 rows)
Columns: `order` | `name` | `description` | `instructions` | `service_info` | `items`

### Sheet 8: Local Recommendations (12+ rows)
Columns: `order` | `category` | `name` | `description` | `address` | `distance` | `link` | `note`

### Sheet 9: Emergency Contacts (6 rows)
Columns: `order` | `type` | `name` | `phone` | `address` | `hours` | `note`

### Sheet 10: Transport Options (5 sections)
Columns: `section` | `title` | `description` | `info` | `fares` | `limitations` | `note`

### Sheet 11: Safety Info (3 rows)
Columns: `order` | `item_text`

### Sheet 12: Packing List (6 rows)
Columns: `order` | `item_text`

This structure allows easy editing in Google Sheets while maintaining all functionality.
