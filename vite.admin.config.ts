import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// Builds the admin SPA into dist/admin/.
// Dev server proxies /api/* to the production server (run on PORT 3000)
// so Google sign-in + locale CRUD work locally.
export default defineConfig({
  root: "admin",
  base: "/admin/",
  plugins: [react()],
  resolve: {
    alias: {
      "@admin": path.resolve(__dirname, "admin"),
    },
  },
  build: {
    outDir: path.resolve(__dirname, "dist/admin"),
    emptyOutDir: true,
  },
  server: {
    port: 5174,
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
