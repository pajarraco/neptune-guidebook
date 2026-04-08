# Material Symbols Icon Utilities

This document describes the CSS utility classes available for styling Material Symbols icons throughout the Neptune Guidebook application.

## Base Class

All Material Symbols icons should use the base class:

```html
<span class="material-symbols-outlined">icon_name</span>
```

## Utility Classes

### Icon Sizes

Use these classes to control icon size:

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

| Class             | Color                | Usage                                    |
| ----------------- | -------------------- | ---------------------------------------- |
| `.icon-sand`      | Sand color           | Default for most icons                   |
| `.icon-primary`   | Primary color        | Important actions                        |
| `.icon-secondary` | Secondary text color | Less prominent icons                     |
| `.icon-aqua`      | Aqua blue            | Feature highlights, interactive elements |
| `.icon-surface`   | Surface/white        | Icons on dark backgrounds                |

### Icon Variation Settings

| Class                   | Settings                     | Usage                               |
| ----------------------- | ---------------------------- | ----------------------------------- |
| `.icon-filled`          | FILL: 1, wght: 400           | Filled icons (checkmarks, features) |
| `.icon-outlined`        | FILL: 0, wght: 400           | Default outlined icons              |
| `.icon-outlined-medium` | FILL: 0, wght: 500           | Medium weight outlined              |
| `.icon-outlined-light`  | FILL: 0, wght: 300, opsz: 60 | Light outlined (rule cards)         |

### Combined Utility Classes

For common patterns, use these combined classes:

| Class             | Effect                                       |
| ----------------- | -------------------------------------------- |
| `.icon-inline`    | Vertical align middle + 0.5rem margin right  |
| `.icon-inline-sm` | Vertical align middle + 0.25rem margin right |
| `.icon-inline-xs` | Vertical align middle + 0.3rem margin right  |

## Context-Specific Classes

These classes are pre-configured for specific use cases:

### Navigation

```html
<span class="material-symbols-outlined nav-icon">home</span>
```

- Size: 24px
- Outlined by default
- Filled when active

### Features

```html
<span class="material-symbols-outlined feature-icon">star</span>
```

- Size: 1.5rem
- Color: Aqua blue
- Filled style

### Team Icons

```html
<span class="material-symbols-outlined team-icon">person</span>
```

- Size: 1.5rem
- Color: Aqua blue
- Outlined style

### Rule Icons

```html
<span class="material-symbols-outlined rule-icon">rule_name</span>
```

- Size: 48px
- Color: Sand
- Light outlined style
- Display: block
- Margin bottom: 1rem

### Check Icons

```html
<span class="material-symbols-outlined check-icon">check_circle</span>
```

- Size: 1.5rem
- Filled style
- Color transitions on hover

### Dropdown Arrow

```html
<span class="material-symbols-outlined dropdown-arrow">expand_more</span>
```

- Size: 20px
- Color: #666

## Usage Examples

### Simple Icon with Size and Color

```html
<span class="material-symbols-outlined icon-base icon-sand">location_on</span>
```

### Inline Icon with Spacing

```html
<span class="material-symbols-outlined icon-inline icon-base icon-sand"
  >phone</span
>
Call us
```

### Complex Icon with Multiple Utilities

```html
<span
  class="material-symbols-outlined icon-2xl icon-middle icon-mr-md icon-sand"
>
  wifi
</span>
```

### Using Context-Specific Classes

```html
<!-- Navigation -->
<span class="material-symbols-outlined nav-icon">home</span>

<!-- Feature List -->
<span class="material-symbols-outlined feature-icon">check_circle</span>

<!-- Rule Card -->
<span class="material-symbols-outlined rule-icon">no_smoking</span>
```

## Migration Guide

### Before (Inline Styles)

```tsx
<span
  className="material-symbols-outlined"
  style={{
    fontSize: "1.25rem",
    verticalAlign: "middle",
    marginRight: "0.5rem",
    color: "var(--sand-color)",
  }}
>
  phone
</span>
```

### After (Utility Classes)

```tsx
<span className="material-symbols-outlined icon-base icon-inline icon-sand">
  phone
</span>
```

Or even simpler:

```tsx
<span className="material-symbols-outlined icon-base icon-inline icon-sand">
  phone
</span>
```

## Best Practices

1. **Use utility classes instead of inline styles** for consistency and maintainability
2. **Combine classes** to achieve the desired effect (e.g., `icon-base icon-inline icon-sand`)
3. **Use context-specific classes** when available (e.g., `nav-icon`, `feature-icon`)
4. **Keep icon sizes consistent** within the same context (all phone icons should be the same size)
5. **Use appropriate colors** based on the icon's purpose and background

## Common Patterns

### Section Headers

```html
<h3>
  <span class="material-symbols-outlined icon-2xl icon-inline icon-sand">
    emergency
  </span>
  Emergency Contacts
</h3>
```

### Contact Information

```html
<a href="tel:+1234567890">
  <span class="material-symbols-outlined icon-base icon-inline-sm icon-sand">
    phone
  </span>
  (123) 456-7890
</a>
```

### Location/Address

```html
<p>
  <span class="material-symbols-outlined icon-md icon-inline-sm icon-sand">
    location_on
  </span>
  123 Main Street
</p>
```

### Tips and Notes

```html
<div class="tip-box">
  <span class="material-symbols-outlined icon-base icon-inline icon-sand">
    info
  </span>
  Important tip here
</div>
```
