// CLI wrapper around `pullSheetsToLocales`.
// Usage: node scripts/fetch-sheet-data.mjs
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { pullSheetsToLocales } from "./lib/sheets.mjs";
import { getLocalesDir, getSupportedLanguages } from "./lib/locales.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env.local") });

async function main() {
  console.log(`Output directory: ${getLocalesDir()}`);
  const languages = getSupportedLanguages();
  console.log(`Languages: ${languages.join(", ")}\n`);
  try {
    const results = await pullSheetsToLocales({
      languages,
      log: (msg) => console.log(msg),
    });
    const ok = results.filter((r) => r.ok).length;
    console.log(`\n✓ Pulled ${ok}/${results.length} languages`);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

main();
