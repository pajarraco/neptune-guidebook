# Icon Utilities Quick Reference

## Quick Class Combinations

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

## Size Classes (Smallest to Largest)

```
.icon-xs    → 1rem       (16px)
.icon-sm    → 1.0625rem  (17px)
.icon-md    → 1.125rem   (18px)
.icon-base  → 1.25rem    (20px)
.icon-lg    → 1.375rem   (22px)
.icon-xl    → 1.5rem     (24px)
.icon-2xl   → 1.5625rem  (25px)
.icon-3xl   → 2.5rem     (40px)
.icon-4xl   → 3rem       (48px)
```

## Spacing Classes

```
.icon-mr-xs  → margin-right: 0.25rem
.icon-mr-sm  → margin-right: 0.3rem
.icon-mr-md  → margin-right: 0.5rem
.icon-pr-sm  → padding-right: 0.3rem
```

## Color Classes

```
.icon-sand      → var(--sand-color)      [Default content]
.icon-primary   → var(--primary-color)   [Important actions]
.icon-secondary → var(--text-secondary)  [Less prominent]
.icon-aqua      → var(--aqua-blue)       [Interactive/features]
.icon-surface   → var(--surface)         [On dark backgrounds]
```

## Alignment Classes

```
.icon-middle           → vertical-align: middle
.icon-middle-offset    → vertical-align: middle + margin-top: -0.1rem
.icon-middle-offset-lg → vertical-align: middle + margin-top: -0.5rem
```

## Combined Classes

```
.icon-inline    → vertical-align: middle + margin-right: 0.5rem
.icon-inline-sm → vertical-align: middle + margin-right: 0.25rem
.icon-inline-xs → vertical-align: middle + margin-right: 0.3rem
```

## Style Variations

```
.icon-filled          → Filled icon (FILL: 1)
.icon-outlined        → Outlined icon (FILL: 0)
.icon-outlined-medium → Outlined medium weight
.icon-outlined-light  → Outlined light weight
```

## Context-Specific Classes

```
.nav-icon      → 24px, outlined (filled when active)
.feature-icon  → 1.5rem, aqua, filled
.team-icon     → 1.5rem, aqua, outlined
.rule-icon     → 48px, sand, light outlined, block display
.check-icon    → 1.5rem, filled, color transitions
.dropdown-arrow→ 20px, gray
```

## Usage by Context

### Section Headers (h2, h3)

```html
<h3>
  <span class="material-symbols-outlined icon-2xl icon-inline icon-sand"
    >emergency</span
  >
  Emergency Contacts
</h3>
```

### Contact Info

```html
<!-- Phone -->
<span class="material-symbols-outlined icon-base icon-inline-sm icon-sand"
  >phone</span
>

<!-- Address -->
<span class="material-symbols-outlined icon-md icon-inline-sm icon-sand"
  >location_on</span
>

<!-- Hours -->
<span class="material-symbols-outlined icon-sm icon-inline-sm icon-sand"
  >schedule</span
>
```

### Tips & Notes

```html
<span class="material-symbols-outlined icon-base icon-inline icon-sand"
  >info</span
>
```

### Links & Actions

```html
<span class="material-symbols-outlined icon-lg icon-inline-sm icon-sand"
  >map</span
>
```

### Feature Lists

```html
<span class="material-symbols-outlined feature-icon">check_circle</span>
```

## Migration Cheat Sheet

| Old Inline Style             | New Classes     |
| ---------------------------- | --------------- |
| `fontSize: "1rem"`           | `icon-xs`       |
| `fontSize: "1.125rem"`       | `icon-md`       |
| `fontSize: "1.25rem"`        | `icon-base`     |
| `fontSize: "1.5625rem"`      | `icon-2xl`      |
| `fontSize: "3rem"`           | `icon-4xl`      |
| `verticalAlign: "middle"`    | `icon-middle`   |
| `marginRight: "0.25rem"`     | `icon-mr-xs`    |
| `marginRight: "0.5rem"`      | `icon-mr-md`    |
| `color: "var(--sand-color)"` | `icon-sand`     |
| `color: "var(--aqua-blue)"`  | `icon-aqua`     |
| `FILL: 1`                    | `icon-filled`   |
| `FILL: 0`                    | `icon-outlined` |

## Common Combinations

```html
<!-- Small detail icon -->
icon-md icon-middle icon-mr-xs icon-sand

<!-- Standard inline icon -->
icon-base icon-inline-sm icon-sand

<!-- Large header icon -->
icon-2xl icon-inline icon-sand

<!-- Filled feature icon -->
icon-xl icon-inline icon-aqua icon-filled

<!-- Or just use: -->
feature-icon
```

## Pro Tips

1. **Start with context classes**: Use `nav-icon`, `feature-icon`, etc. when available
2. **Build up**: Start with size, add spacing, then color
3. **Use inline helpers**: `icon-inline`, `icon-inline-sm` cover 90% of cases
4. **Default to sand**: Most content icons use `icon-sand`
5. **Aqua for features**: Interactive elements and features use `icon-aqua`
