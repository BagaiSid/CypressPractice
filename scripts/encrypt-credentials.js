#!/usr/bin/env node
/**
 * Encrypt sensitive fields in fixture files.
 *
 * Usage:
 *   CREDENTIALS_KEY=my-secret-key node scripts/encrypt-credentials.js
 *
 * This rewrites the fixture JSON files in-place, replacing plaintext
 * credential values with AES-256-GCM encrypted blobs.  Non-sensitive
 * fields are left untouched.
 */
const fs = require("fs");
const path = require("path");
const { encrypt, ENC_PREFIX } = require("../cypress/support/crypto");

const KEY = process.env.CREDENTIALS_KEY;
if (!KEY) {
  console.error("❌  Set CREDENTIALS_KEY environment variable first.");
  console.error("    Example:  CREDENTIALS_KEY=my-secret node scripts/encrypt-credentials.js");
  process.exit(1);
}

// Fields that contain sensitive data and should be encrypted
const SENSITIVE_FIELDS = [
  "validUsername",
  "validPassword",
  "invalidUsername",
  "invalidPassword",
];

function encryptFields(obj, fieldNames, passphrase) {
  const result = { ...obj };
  for (const key of fieldNames) {
    if (
      typeof result[key] === "string" &&
      !result[key].startsWith(ENC_PREFIX)
    ) {
      console.log(`  🔒 Encrypting field: ${key}`);
      result[key] = encrypt(result[key], passphrase);
    } else if (typeof result[key] === "string" && result[key].startsWith(ENC_PREFIX)) {
      console.log(`  ⏭  Already encrypted: ${key}`);
    }
  }
  return result;
}

// ── Process each fixture file ───────────────────────────
const fixtures = [
  path.resolve(__dirname, "../cypress/fixtures/hrDashboardWeb.json"),
  path.resolve(__dirname, "../cypress/fixtures/hrDashboard.json"),
];

fixtures.forEach((filePath) => {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Skipping (not found): ${filePath}`);
    return;
  }

  console.log(`\n📄 Processing: ${path.basename(filePath)}`);
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const encrypted = encryptFields(data, SENSITIVE_FIELDS, KEY);
  fs.writeFileSync(filePath, JSON.stringify(encrypted, null, 2) + "\n");
  console.log(`  ✅ Saved.`);
});

console.log("\n🎉 Done! Encrypted credentials are safe to commit.");
console.log("🔑 Store your CREDENTIALS_KEY in .env (which is .gitignore'd).");
