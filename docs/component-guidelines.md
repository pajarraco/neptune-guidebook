# Component Development Guidelines

## Language Selector Component

### Purpose
Provides a dropdown menu for users to switch between available languages.

### Location & Positioning
- **File**: `src/components/LanguageSelector.tsx`
- **Styles**: `src/components/LanguageSelector.css`
- **Position**: Fixed in top-right corner of the banner
- **Z-index**: 1000 (stays above all content)

### Implementation Details

**State Management:**
```typescript
const [isOpen, setIsOpen] = useState(false);
```
- Tracks dropdown open/closed state
- Closes automatically after language selection

**Current Language Detection:**
```typescript
const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];
```
- Finds current language from i18n
- Falls back to first language (English) if not found

**Language Change Handler:**
```typescript
const changeLanguage = (langCode: string) => {
  i18n.changeLanguage(langCode);
  setIsOpen(false);
};
```
- Changes language via i18next
- Closes dropdown after selection

### Styling Requirements

**Toggle Button:**
- Display: flex with 8px gap
- Background: white
- Padding: 8px 16px
- Border-radius: 25px
- Box-shadow for depth
- Hover effect: increased shadow

**Dropdown Menu:**
- Position: absolute, below toggle button
- Background: white
- Border-radius: 12px
- Min-width: 160px
- Box-shadow for depth

**Responsive Behavior:**
- Mobile (≤768px): Hide language code, show only flag
- Small screens (≤480px): Reduce sizes

### Icon Requirements
**CRITICAL**: Always use `material-symbols-outlined` class for Material Icons, not `material-icons`.

```tsx
<span className="material-symbols-outlined dropdown-arrow">
  {isOpen ? 'expand_less' : 'expand_more'}
</span>
```

## Navigation Component

### Link Handling
When implementing navigation links:

1. **Use section IDs** - Never use translated text for navigation
2. **Valid section IDs**: `property-info`, `check-in-out`, `local-guide`, `transport`, `amenities`, `emergency`
3. **onClick handler**: Should call `onNavigate(sectionId)` or similar navigation function

Example:
```tsx
<li 
  className={feature.link ? 'clickable' : ''}
  onClick={() => feature.link && onNavigate(feature.link)}
>
  {feature.text}
</li>
```

## General Component Rules

### Material Icons
- **Class name**: `material-symbols-outlined` (not `material-icons`)
- **Common icons**: `expand_more`, `expand_less`, `location_on`, `wifi`, `phone_iphone`

### Internationalization
- **Import**: `import { useTranslation } from 'react-i18next';`
- **Usage**: `const { t, i18n } = useTranslation();`
- **Translation keys**: Use dot notation (e.g., `t('welcome.featuresSection.title')`)
- **Arrays**: Use `returnObjects: true` for array translations

Example:
```typescript
const features = t('welcome.featuresSection.features', { 
  returnObjects: true 
}) as Array<{text: string; link?: string}>;
```

### TypeScript Types
- Define proper interfaces for props
- Use type assertions for i18n array returns
- Optional properties should use `?` notation

### Responsive Design
- Mobile-first approach
- Use media queries for breakpoints:
  - `@media (max-width: 768px)` - Tablet/mobile
  - `@media (max-width: 480px)` - Small mobile

### Styling Conventions
- Use CSS modules or separate CSS files
- Class naming: kebab-case (e.g., `language-selector-toggle`)
- Consistent spacing: 8px base unit
- Colors: Use existing theme colors
- Shadows: Subtle for depth (e.g., `0 2px 8px rgba(0, 0, 0, 0.1)`)

## Accessibility

### ARIA Labels
Always include aria-label for icon-only buttons:
```tsx
<button aria-label="Select language">
  <span className="flag">{currentLanguage.flag}</span>
</button>
```

### Keyboard Navigation
- Ensure all interactive elements are keyboard accessible
- Use semantic HTML (button, nav, etc.)
- Maintain logical tab order

### Screen Readers
- Use semantic HTML elements
- Provide text alternatives for icons
- Ensure state changes are announced

## Performance

### State Updates
- Minimize unnecessary re-renders
- Use callback functions for state updates when needed
- Close dropdowns/modals after actions complete

### Event Handlers
- Use arrow functions in JSX sparingly
- Define handlers outside render when possible
- Clean up event listeners in useEffect cleanup

### Code Splitting
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Lazy load heavy components when appropriate
