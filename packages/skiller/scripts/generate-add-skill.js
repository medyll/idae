#!/usr/bin/env node
/**
 * Script to generate add-skill.js files for all packages
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const pkgs = [
  'idae-api', 'idae-be', 'idae-cadenzia', 'idae-csss', 'idae-db', 'idae-dom-events',
  'idae-engine', 'idae-html', 'idae-htmlu', 'idae-idbql', 'idae-machine', 'idae-query',
  'idae-router', 'idae-slotui', 'idae-socket', 'idae-stator', 'idae-sync', 'qoolie'
];

const template = `#!/usr/bin/env node
/**
 * Add-skill CLI entry point for @medyll packages
 * Usage: npx @medyll/<package> add-skill
 */
import { findSkillMd, interactivePrompt, getPackageName, findPackageJson } from '@medyll/skiller';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve package directory (dist/cli -> dist -> package root)
const distDir = path.resolve(__dirname, '..');
const pkgDir = path.resolve(distDir, '..');

// Find package.json to get the actual package name
const pkgJsonPath = findPackageJson(pkgDir);
let pkgName = 'unknown';

if (pkgJsonPath) {
  pkgName = getPackageName(pkgJsonPath);
}

// Find SKILL.md in standard locations (pass pkgName for correct path resolution)
const skillSrc = findSkillMd(pkgDir, pkgName);

if (!skillSrc) {
  console.error(\`No SKILL.md found for "\${pkgName}"\`);
  console.error('Searched: src/lib/skill/<pkg>/, dist/skill/<pkg>/, lib/skill/<pkg>/, package root');
  console.error(\`Run "npx @medyll/skiller create-skill" in the package directory to create one.\`);
  process.exit(1);
}

await interactivePrompt({ pkgName, skillSrc });
`;

pkgs.forEach(pkg => {
  const pkgDir = path.join(rootDir, 'packages', pkg);
  const distCliDir = path.join(pkgDir, 'dist', 'cli');
  const outFile = path.join(distCliDir, 'add-skill.js');
  
  fs.mkdirSync(distCliDir, { recursive: true });
  fs.writeFileSync(outFile, template, 'utf8');
  console.log(`Created: ${pkg}`);
});

console.log('\\nDone! Created add-skill.js for all packages.');
