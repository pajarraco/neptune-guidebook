import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import path from "node:path";

// Guest app build. Source lives in src/app/, output goes to dist/.
export default defineConfig({
  root: "src/app",
  envDir: __dirname,
  // Separate cache dir from the admin Vite so the two dev servers don't
  // overwrite each other's pre-bundled deps.
  cacheDir: path.resolve(__dirname, "node_modules/.vite-app"),
  publicDir: path.resolve(__dirname, "public"),
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
    },
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
});
