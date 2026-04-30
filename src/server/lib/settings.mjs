// Read/write settings JSON files on the volume.
import fs from "node:fs/promises";
import path from "node:path";

export function getSettingsDir() {
  return process.env.SETTINGS_DIR
    ? path.resolve(process.env.SETTINGS_DIR)
    : path.resolve("dist/settings");
}

export function getSupportedSettings() {
  const raw = process.env.SETTINGS || process.env.VITE_SETTINGS || "config";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function settingsPath(setting) {
  if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(setting)) {
    throw new Error(`Invalid setting name: ${setting}`);
  }
  return path.join(getSettingsDir(), `${setting}.json`);
}

export async function listSettings() {
  const supported = getSupportedSettings();
  const dir = getSettingsDir();
  const out = [];
  for (const setting of supported) {
    const p = settingsPath(setting);
    try {
      const stat = await fs.stat(p);
      out.push({ setting, exists: true, mtime: stat.mtimeMs });
    } catch {
      out.push({ setting, exists: false, mtime: null });
    }
  }
  return { settings: out, dir };
}

export async function readSetting(setting) {
  const raw = await fs.readFile(settingsPath(setting), "utf8");
  return JSON.parse(raw);
}

export async function writeSetting(setting, data) {
  const file = settingsPath(setting);
  await fs.mkdir(path.dirname(file), { recursive: true });
  // Atomic write.
  const tmp = `${file}.tmp.${process.pid}`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2) + "\n", "utf8");
  await fs.rename(tmp, file);
}
