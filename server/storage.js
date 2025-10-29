import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");

export function ensureDataDirs() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  const defaults = ["assets.json", "config.json"];
  for (const f of defaults) {
    const fp = path.join(dataDir, f);
    if (!fs.existsSync(fp)) {
      fs.writeFileSync(fp, f === "assets.json" ? JSON.stringify({ assets: [] }, null, 2) : "{}\n");
    }
  }
}

export function readJson(filename, fallback) {
  const fp = path.join(dataDir, filename);
  try {
    const raw = fs.readFileSync(fp, "utf8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeJson(filename, obj) {
  const fp = path.join(dataDir, filename);
  fs.writeFileSync(fp, JSON.stringify(obj, null, 2));
}


