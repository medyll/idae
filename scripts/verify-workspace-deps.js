// scripts/verify-workspace-deps.js
// Vérifie que toutes les dépendances internes @medyll utilisent workspace:*

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PACKAGES_DIR = path.join(ROOT, 'packages');

function checkDeps(pkgJson, pkgPath) {
  let ok = true;
  const fields = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
  for (const field of fields) {
    if (!pkgJson[field]) continue;
    for (const dep in pkgJson[field]) {
      if (dep.startsWith('@medyll/')) {
        if (pkgJson[field][dep] !== '*') {
          console.error(`❌ ${pkgPath}: ${field} -> ${dep} doit être \"*\" (trouvé: \"${pkgJson[field][dep]}\")`);
          ok = false;
        }
      }
    }
  }
  return ok;
}

function walkPackages(dir) {
  const entries = fs.readdirSync(dir);
  let allOk = true;
  for (const entry of entries) {
    const pkgPath = path.join(dir, entry);
    console.log(`\nVérification du package: ${entry}`);
    if (fs.statSync(pkgPath).isDirectory()) {
      const pkgJsonPath = path.join(pkgPath, 'package.json');
      if (fs.existsSync(pkgJsonPath)) {
        const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
        console.log(`Vérification du package: ${pkgJson.name || pkgJsonPath}`);
        if (!checkDeps(pkgJson, pkgJsonPath)) allOk = false;
      }
    }
  }
  return allOk;
}

function main() {
  let ok = walkPackages(PACKAGES_DIR);
  // Optionally, check packages-config/*
  const configDir = path.join(ROOT, 'packages-config');
  if (fs.existsSync(configDir)) {
    if (!walkPackages(configDir)) ok = false;
  }
  if (!ok) {
    console.error('\nAu moins une dépendance interne @medyll n\'utilise pas next');
    process.exit(1);
  } else {
    console.log('✅ Toutes les dépendances internes @medyll utilisent next');
  }
}

if (require.main === module) main();
