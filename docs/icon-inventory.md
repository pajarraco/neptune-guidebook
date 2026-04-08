# Material Symbols Icon Inventory

This document catalogs all Material Symbols icons currently used in the Neptune Guidebook application.

## Icons by Component

### LanguageSelector.tsx

- `expand_less` - Collapse dropdown
- `expand_more` - Expand dropdown

### PropertyInfoSection.tsx

- `location_on` - Address marker
- `schedule` - Check-in/check-out times (2 instances)
- `wifi` - WiFi section header

### CodeEntryModal.tsx

- `lock` - Modal header (large, 3rem)
- `error` - Error message indicator
- `lock_open` - Submit button

### LocalGuideSection.tsx

- `location_on` - Recommendation addresses
- `directions_car` - Driving distance
- `directions_walk` - Walking distance
- `map` - View on maps link
- `info` - Tip box

### AmenitiesSection.tsx

- `lightbulb` - Tip box

### EmergencySection.tsx

- `emergency` - Emergency alert header
- `phone` - Contact phone numbers
- `location_on` - Contact addresses
- `schedule` - Operating hours
- `local_fire_department` - Safety info header
- `location_on` - Address note (tip box)

### TransportSection.tsx

- `flight_takeoff` - Airport section
- `train` - Train section
- `directions_car` - Car rental section
- `local_taxi` - Taxi section
- `phone` - Taxi contact
- `local_shipping` - Luggage section

### HouseRulesSection.tsx

Icons are dynamically assigned from `ruleIcons` array:

- Various icons based on rule type
- Default: `info`

### Navigation.tsx

- Dynamic icons based on section (from navigation data)
- Common icons include:
  - `home` - Welcome/Home
  - `info` - Property Info
  - `login` - Check In/Out
  - `local_shipping` - Transport
  - `gavel` - House Rules
  - `weekend` - Amenities
  - `explore` - Local Guide
  - `emergency` - Emergency

### WelcomeSection.tsx (inferred from feature-icon usage)

- `check_circle` - Feature list items (filled)
- `person` - Team member icons

### CheckInOutSection.tsx (inferred from check-icon usage)

- `check_circle` - Checklist items

### FloatingChatButton (from CSS)

- Icon for chat button (likely `chat` or `message`)

### Mobile Header (from CSS)

- `location_on` - Mobile address display
- `expand_more` - Chevron down icon

## Icons by Category

### Navigation & Wayfinding

- `location_on` - Used extensively for addresses and locations
- `map` - Map links
- `directions_car` - Driving directions
- `directions_walk` - Walking directions
- `expand_more` / `expand_less` - Dropdown controls

### Time & Schedule

- `schedule` - Times and hours

### Communication

- `phone` - Phone numbers
- `chat` / `message` - Chat button (inferred)

### Transportation

- `flight_takeoff` - Airport
- `train` - Train/rail
- `directions_car` - Car/driving
- `local_taxi` - Taxi
- `local_shipping` - Luggage/shipping

### Safety & Emergency

- `emergency` - Emergency alerts
- `local_fire_department` - Fire safety

### Amenities & Features

- `wifi` - WiFi information
- `check_circle` - Completed items, features
- `lightbulb` - Tips and suggestions
- `info` - Information notes

### Security & Access

- `lock` - Locked/secure
- `lock_open` - Unlock/access
- `error` - Error states
- `login` - Check-in/access

### General

- `home` - Home/welcome
- `info` - Information
- `gavel` - Rules
- `weekend` - Amenities
- `explore` - Exploration/guide
- `person` - People/team

## Icon Size Distribution

### Extra Small (1rem)

- Error messages

### Small (1.0625rem - 1.125rem)

- Schedule/hours details
- Addresses in cards
- Distance indicators

### Base (1.25rem)

- Phone numbers
- Tip box icons
- Info cards

### Large (1.375rem)

- Map links
- Action buttons

### Extra Large (1.5rem - 1.5625rem)

- Section headers
- Feature icons
- WiFi section

### 2X-3X Large (2.5rem)

- Mobile chevron

### 4X Large (3rem)

- Modal headers (lock icon)

### Jumbo (48px)

- Rule card icons

## Color Distribution

### Sand Color (var(--sand-color))

- Most icons throughout the app
- Default color for content icons

### Aqua Blue (var(--aqua-blue))

- Feature icons
- Team icons
- Interactive elements
- Hover states

### Primary Color (var(--primary-color))

- Important actions
- Links

### Surface/White (var(--surface))

- Icons on dark backgrounds
- Floating chat button
- Mobile header icons

### Gray (#666)

- Dropdown arrows

## Variation Settings Distribution

### Filled Icons

- `check_circle` - Checkmarks
- Feature icons
- Active navigation icons
- Mobile location icon

### Outlined Icons (Default)

- Most content icons
- Navigation icons (inactive)
- Team icons

### Outlined Medium Weight

- Active navigation icons

### Outlined Light

- Rule card icons (large decorative icons)

## Recommendations

1. **Consistency**: Use `location_on` consistently for all addresses
2. **Size Hierarchy**: Maintain size hierarchy (headers > content > details)
3. **Color Coding**:
   - Sand for content
   - Aqua for interactive/features
   - Primary for actions
4. **Filled vs Outlined**:
   - Use filled for completed states and features
   - Use outlined for general content
5. **Accessibility**: Ensure icons have appropriate text labels or aria-labels

## Future Considerations

1. Consider adding more transportation icons (bus, ferry, etc.)
2. Add weather-related icons if needed
3. Consider activity/recreation icons for local guide
4. Add more amenity-specific icons (pool, gym, etc.)
