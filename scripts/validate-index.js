// Validation script for index.json format 1
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const indexPath = resolve(__dirname, "../index.json");
const content = readFileSync(indexPath, "utf8");
const index = JSON.parse(content);

if (index.format !== 1) {
  throw new Error("Expected format: 1, got " + index.format);
}
if (!index.title || (!index.title.en && typeof index.title !== "string")) {
  throw new Error("index.json must contain title with en");
}
if (!Array.isArray(index.plugins)) {
  throw new Error("index.json plugins must be an array");
}

for (const plugin of index.plugins) {
  if (!plugin.name || typeof plugin.name !== "string") {
    throw new Error("Plugin missing valid name");
  }
  if (!Array.isArray(plugin.versions) || plugin.versions.length === 0) {
    throw new Error("Plugin " + plugin.name + " must have at least one version");
  }
  for (const v of plugin.versions) {
    if (!v.version || !v.source) {
      throw new Error("Plugin version invalid in " + plugin.name);
    }
  }
}

console.log("✓ index.json validated successfully! Plugins: " + index.plugins.length);
