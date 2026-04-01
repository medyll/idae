#!/usr/bin/env node
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
  console.error(`No SKILL.md found for "${pkgName}"`);
  console.error('Searched: src/lib/skill/<pkg>/, dist/skill/<pkg>/, lib/skill/<pkg>/, package root');
  console.error(`Run "npx @medyll/skiller create-skill" in the package directory to create one.`);
  process.exit(1);
}

await interactivePrompt({ pkgName, skillSrc });
