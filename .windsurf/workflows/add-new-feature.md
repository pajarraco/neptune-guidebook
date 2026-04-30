---
description: Add a new feature to the welcome section
---

# Adding a New Feature to Welcome Section

## Steps

1. **Add to Google Sheets (English tab)**:

   ```
   welcome_feature_4_text | New feature text
   welcome_feature_4_icon | icon_name
   welcome_feature_4_link | section-id
   ```

2. **Add translations to other language sheets** (without link):

   ```
   welcome_feature_4_text | Texto de nueva función
   welcome_feature_4_icon | icon_name
   ```

3. **Run fetch script**:
   - Locally: `npm run fetch-data`
   - Production: Click "Pull from Google Sheets" in `/admin`

4. **Verify**:
   - Check that the new feature appears in the welcome section
   - Test that the link navigates to the correct section
   - Ensure translations work for all languages

## Important Notes

- **CRITICAL**: Use valid section IDs in link column: `property-info`, `check-in-out`, `local-guide`, `transport`, `amenities`, `emergency`
- **CRITICAL**: Do NOT include link property in non-English sheets - the fetch script automatically excludes them
- Icon names must be from Material Symbols (see `docs/icons.md`)
- Use consistent numbering (don't skip numbers in sequences)
