#!/usr/bin/env node
import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL("..", import.meta.url)), "public", "logos");
const REQUIRED = [
  "baidu",
  "aliyun",
  "quark",
  "weiyun",
  "115",
  "123",
  "tianyi",
  "xunlei",
];

const missing = REQUIRED.filter((id) => !existsSync(join(ROOT, `${id}.png`)));

if (missing.length > 0) {
  console.error(
    `Missing logo files: ${missing.map((id) => `${id}.png`).join(", ")}\n` +
      "Run: python3 scripts/download-logos.py"
  );
  process.exit(1);
}

console.log(`All ${REQUIRED.length} drive logos present.`);
