// Read/write locale JSON files on the volume.
import fs from "node:fs/promises";
import path from "node:path";

export function getLocalesDir() {
  return process.env.LOCALES_DIR
    ? path.resolve(process.env.LOCALES_DIR)
    : path.resolve("dist/locales");
}

export function getSupportedLanguages() {
  const raw = process.env.LANGUAGES || process.env.VITE_LANGUAGES || "en";
  return raw
    .split(",")
    .map((l) => l.trim())
    .filter(Boolean);
}

function languagePath(lang) {
  if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(lang)) {
    throw new Error(`Invalid language code: ${lang}`);
  }
  return path.join(getLocalesDir(), `${lang}.json`);
}

export async function listLanguages() {
  const supported = getSupportedLanguages();
  const dir = getLocalesDir();
  const out = [];
  for (const lang of supported) {
    const p = languagePath(lang);
    try {
      const stat = await fs.stat(p);
      out.push({ lang, exists: true, mtime: stat.mtimeMs });
    } catch {
      out.push({ lang, exists: false, mtime: null });
    }
  }
  return { languages: out, dir };
}

export async function readLanguage(lang) {
  const raw = await fs.readFile(languagePath(lang), "utf8");
  return JSON.parse(raw);
}

export async function writeLanguage(lang, data) {
  const file = languagePath(lang);
  await fs.mkdir(path.dirname(file), { recursive: true });
  // Atomic write.
  const tmp = `${file}.tmp.${process.pid}`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2) + "\n", "utf8");
  await fs.rename(tmp, file);
}
