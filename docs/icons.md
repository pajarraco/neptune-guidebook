# Icons Guide

This guide covers Material Symbols icon usage in the Neptune Guidebook application.

## Base Class

All Material Symbols icons should use the base class:

```html
<span class="material-symbols-outlined">icon_name</span>
```

**CRITICAL**: Always use `material-symbols-outlined` class, not `material-icons`.

## Utility Classes

### Icon Sizes

| Class        | Size      | Usage                                           |
| ------------ | --------- | ----------------------------------------------- |
| `.icon-xs`   | 1rem      | Extra small icons (error messages, inline text) |
| `.icon-sm`   | 1.0625rem | Small icons (hours, schedule details)           |
| `.icon-md`   | 1.125rem  | Medium icons (addresses, distances)             |
| `.icon-base` | 1.25rem   | Base size icons (phone numbers, tips)           |
| `.icon-lg`   | 1.375rem  | Large icons (map links, action buttons)         |
| `.icon-xl`   | 1.5rem    | Extra large icons (feature lists, team icons)   |
| `.icon-2xl`  | 1.5625rem | 2X large icons (section headers, wifi)          |
| `.icon-3xl`  | 2.5rem    | 3X large icons (mobile chevron)                 |
| `.icon-4xl`  | 3rem      | 4X large icons (modal headers)                  |

### Icon Alignment

| Class                    | Effect                                          |
| ------------------------ | ----------------------------------------------- |
| `.icon-middle`           | Vertically align middle                         |
| `.icon-middle-offset`    | Vertically align middle with -0.1rem top margin |
| `.icon-middle-offset-lg` | Vertically align middle with -0.5rem top margin |

### Icon Spacing

| Class         | Spacing               |
| ------------- | --------------------- |
| `.icon-mr-xs` | Margin right: 0.25rem |
| `.icon-mr-sm` | Margin right: 0.3rem  |
| `.icon-mr-md` | Margin right: 0.5rem  |
| `.icon-pr-sm` | Padding right: 0.3rem |

### Icon Colors

| Class             | Color               | Usage                           |
| ----------------- | ------------------- | ------------------------------- |
| `.icon-sand`      | `--sand-color`      | Default icon color (sand/brown) |
| `.icon-aqua`      | `--aqua-blue`       | Accent color (teal/cyan)        |
| `.icon-primary`   | `--primary-color`   | Primary accent (dark teal)      |
| `.icon-secondary` | `--secondary-color` | Secondary accent (light teal)   |
| `.icon-surface`   | `--text-primary`    | Text color (dark gray)          |

### Icon Styles

| Class                   | Effect                 |
| ----------------------- | ---------------------- |
| `.icon-filled`          | Filled style           |
| `.icon-outlined`        | Outlined style         |
| `.icon-outlined-medium` | Medium weight outlined |
| `.icon-outlined-light`  | Light weight outlined  |

### Context-Specific Classes

| Class             | Usage                            |
| ----------------- | -------------------------------- |
| `.nav-icon`       | Navigation menu icons            |
| `.feature-icon`   | Feature list icons               |
| `.team-icon`      | Team member icons                |
| `.rule-icon`      | House rule icons                 |
| `.check-icon`     | Checklist icons                  |
| `.dropdown-arrow` | Language selector dropdown arrow |

## Quick Examples

### Common Patterns (Copy & Paste Ready)

```html
<!-- Small inline icon (addresses, details) -->
<span class="material-symbols-outlined icon-md icon-inline-sm icon-sand"
  >location_on</span
>

<!-- Medium inline icon (phone, tips) -->
<span class="material-symbols-outlined icon-base icon-inline-sm icon-sand"
  >phone</span
>

<!-- Large inline icon (section headers) -->
<span class="material-symbols-outlined icon-2xl icon-inline icon-sand"
  >wifi</span
>

<!-- Feature icon (filled, aqua) -->
<span class="material-symbols-outlined feature-icon">check_circle</span>

<!-- Navigation icon -->
<span class="material-symbols-outlined nav-icon">home</span>

<!-- Rule card icon -->
<span class="material-symbols-outlined rule-icon">no_smoking</span>

<!-- Team member icon -->
<span class="material-symbols-outlined team-icon">person</span>

<!-- Dropdown arrow -->
<span class="material-symbols-outlined dropdown-arrow">expand_more</span>
```

## Icon Inventory

### Icons by Component

#### LanguageSelector.tsx

- `expand_less` - Collapse dropdown
- `expand_more` - Expand dropdown

#### PropertyInfoSection.tsx

- `location_on` - Address marker
- `schedule` - Check-in/check-out times (2 instances)
- `wifi` - WiFi section header

#### CodeEntryModal.tsx

- `lock` - Modal header (large, 3rem)
- `error` - Error message indicator
- `lock_open` - Submit button

#### LocalGuideSection.tsx

- `location_on` - Recommendation addresses
- `directions_car` - Driving distance
- `directions_walk` - Walking distance
- `map` - View on maps link
- `info` - Tip box

#### AmenitiesSection.tsx

- `lightbulb` - Tip box

#### EmergencySection.tsx

- `emergency` - Emergency alert header
- `phone` - Contact phone numbers
- `location_on` - Contact addresses
- `schedule` - Operating hours
- `local_fire_department` - Safety info header
- `location_on` - Address note (tip box)

#### TransportSection.tsx

- `flight_takeoff` - Airport section
- `train` - Train section
- `directions_car` - Car rental section
- `local_taxi` - Taxi section

#### CheckInOutSection.tsx

- `check_circle` - Checklist items (completed)
- `radio_button_unchecked` - Checklist items (uncompleted)

#### HouseRulesSection.tsx

- `check_circle` - Rule items
- `no_smoking` - No smoking rule
- `pets` - Pets rule
- `party_mode` - Party rule
- `local_parking` - Parking rule

#### Navigation.tsx

- `home` - Welcome section
- `info` - Property info section
- `door_front` - Check-in/out section
- `directions_car` - Transport section
- `local_parking` - Amenities section
- `restaurant` - Local guide section
- `emergency` - Emergency section

## Best Practices

1. **Always use utility classes** instead of inline styles for icon sizing and colors
2. **Use descriptive class combinations** for context (e.g., `nav-icon`, `feature-icon`)
3. **Keep icon names semantic** - use names that describe the icon's purpose
4. **Test responsive behavior** - ensure icons scale correctly on mobile devices
5. **Use the sand color** as default for consistency across the app

## Common Icons Reference

| Icon Name         | Usage                          |
| ----------------- | ------------------------------ |
| `location_on`     | Addresses, maps                |
| `phone`           | Phone numbers                  |
| `wifi`            | WiFi information               |
| `schedule`        | Time-based info                |
| `emergency`       | Emergency alerts               |
| `info`            | Tips and information           |
| `directions_car`  | Driving/distance               |
| `directions_walk` | Walking distance               |
| `map`             | Map links                      |
| `expand_more`     | Expand/collapse dropdowns      |
| `expand_less`     | Expand/collapse dropdowns      |
| `check_circle`    | Completed items, confirmations |
| `lock`            | Security, access codes         |
| `lightbulb`       | Tips, suggestions              |
