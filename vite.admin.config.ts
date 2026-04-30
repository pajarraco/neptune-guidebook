import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// Builds the admin SPA into dist/admin/.
// Dev server proxies /api/* to the production server (run on PORT 3000)
// so Google sign-in + locale CRUD work locally.
export default defineConfig({
  root: "src/admin",
  base: "/admin/",
  envDir: __dirname,
  // Separate cache dir from the guest Vite so the two dev servers don't
  // overwrite each other's pre-bundled deps (which caused 504 Outdated
  // Optimize Dep on react-hook-form).
  cacheDir: path.resolve(__dirname, "node_modules/.vite-admin"),
  publicDir: false,
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
      "@admin": path.resolve(__dirname, "src/admin"),
    },
  },
  build: {
    outDir: path.resolve(__dirname, "dist/admin"),
    emptyOutDir: true,
  },
  // Pre-bundle these on dev startup so the first /admin/ request doesn't
  // 504 with "Outdated Optimize Dep" while Vite discovers them lazily.
  optimizeDeps: {
    include: ["react-hook-form", "@hookform/resolvers/zod", "zod"],
  },
  server: {
    port: 5174,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        configure(proxy) {
          proxy.on("proxyRes", (proxyRes) => {
            const setCookie = proxyRes.headers["set-cookie"];
            if (setCookie) {
              // Strip Domain= and Secure so the browser stores the cookie
              // for the Vite dev origin (localhost:5174).
              proxyRes.headers["set-cookie"] = setCookie.map((c) =>
                c.replace(/;\s*Domain=[^;]*/gi, "").replace(/;\s*Secure/gi, ""),
              );
            }
          });
        },
      },
    },
  },
});
