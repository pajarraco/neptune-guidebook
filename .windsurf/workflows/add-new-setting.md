---
description: Add a new configuration setting
---

# Adding a New Configuration Setting

## Steps

1. **Create the JSON file**:
   - Create `public/settings/{name}.json`
   - Add your configuration data

2. **Add read method to guest app API** (if guest app needs it):
   - Open `src/app/api.ts`
   - Add a method to fetch the setting:
     ```typescript
     export const api = {
       readConfig: () =>
         request<{ amenityIcons?: string[] }>("/settings/config.json"),
     };
     ```

3. **Add admin endpoints** (if admin needs to edit it):
   - Open `src/admin/api.ts`
   - Add methods to read/write the setting
   - Server already serves `/settings/*` with access code gating

4. **Test**:
   - Run `npm run dev` to test locally
   - Verify the setting loads correctly
   - Test admin editing if applicable

## Notes

- Settings are served at `/settings/{name}.json` with access code gating
- The server automatically serves files from `public/settings/` and `dist/settings/`
- In production, settings should be on the persistent volume at `/app/dist/settings`
