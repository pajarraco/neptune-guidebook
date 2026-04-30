---
description: Add a new admin API endpoint
---

# Adding a New Admin Endpoint

## Steps

1. **Add handler in server**:
   - Open `src/server/server.mjs`
   - Add handler under `handleApi()` function
   - If it mutates state, require session (already done by default for everything except auth/\* routes)

2. **Add API method in admin client**:
   - Open `src/admin/api.ts`
   - Add a method that wraps `fetch()` with proper error handling
   - Components should call this method, not `fetch()` directly

3. **Validate inputs server-side**:
   - Never trust the body
   - Validate all inputs before processing

4. **For file writes**:
   - Use `writeLanguage()` from `lib/locales.mjs` for atomic writes (temp file + rename)
   - Never do partial writes

5. **Test**:
   - Build the project: `npm run build:admin`
   - Test the endpoint locally with the production server
   - Verify authentication works correctly

## Example

```typescript
// src/admin/api.ts
export const api = {
  // ... existing methods
  myNewEndpoint: (data: MyData) =>
    request<MyResponse>("/api/my-endpoint", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
```

```javascript
// src/server/server.mjs
function handleApi(req, res, url) {
  // ... existing handlers

  if (url.pathname === "/api/my-endpoint" && req.method === "POST") {
    if (!session) return unauthorized(res);
    // Handle request
    return success(res, { data });
  }
}
```
