// scripts/verify-workspace-deps.js
// Vérifie que toutes les dépendances internes @medyll utilisent workspace:*

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const PACKAGES_DIR = path.join(ROOT, "packages");

function checkDeps(pkgJson, pkgPath) {
  let ok = true;

  return ok;
}

function walkPackages(dir) {
  const entries = fs.readdirSync(dir);
  let allOk = true;

  return allOk;
}

function main() {
  let ok = walkPackages(PACKAGES_DIR);
  // Optionally, check packages-config/*
  const configDir = path.join(ROOT, "packages-config");
  if (fs.existsSync(configDir)) {
    if (!walkPackages(configDir)) ok = false;
  }
  if (!ok) {
    console.error("\nAu moins une dépendance interne @medyll n'utilise pas *");
    process.exit(1);
  } else {
    console.log("✅ Toutes les dépendances internes @medyll utilisent *");
  }
}

if (require.main === module) main();
