#!/usr/bin/env node
import path from 'path';
import os from 'os';
import readline from 'readline';
import fs from 'fs';
import { findPackageJson, findSkillMd, installSkill } from './index.mjs';

const cwd = process.cwd();
const pkgJsonPath = findPackageJson(cwd);
if (!pkgJsonPath) { console.error('No package.json found.'); process.exit(1); }

const pkgDir = path.dirname(pkgJsonPath);
const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
const pkgName = (pkgJson.name || path.basename(pkgDir)).replace(/^@[^/]+\//, '');

const skillSrc = findSkillMd(pkgDir);
if (!skillSrc) { console.error(`No SKILL.md found for "${pkgName}" (searched lib/skill/, dist/skill/, and package root).`); process.exit(1); }

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

console.log(`\nWhere to install the skill for ${pkgName}?`);
console.log(`  1) user     → ${path.join(os.homedir(), '.claude', 'skills', pkgName, 'SKILL.md')}`);
console.log(`  2) claude   → ${path.join(cwd, '.claude', 'skills', pkgName, 'SKILL.md')}  (current project)`);
console.log(`  3) codex    → ${path.join(os.homedir(), '.codex', 'skills', pkgName, 'SKILL.md')}`);
console.log(`  4) agent    → ${path.join(cwd, '.github', 'skills', pkgName, 'SKILL.md')}  (current project)`);
console.log(`  5) custom   → ask for a custom path`);
console.log('');

rl.question('Enter choice (1-5): ', (choice) => {
  const trimmed = choice.trim();
  let destDir;
  if      (trimmed === '1') destDir = path.join(os.homedir(), '.claude', 'skills', pkgName);
  else if (trimmed === '2') destDir = path.join(cwd, '.claude', 'skills', pkgName);
  else if (trimmed === '3') destDir = path.join(os.homedir(), '.codex', 'skills', pkgName);
  else if (trimmed === '4') destDir = path.join(cwd, '.github', 'skills', pkgName);
  else if (trimmed === '5') {
    rl.question('Enter custom destination directory: ', (p) => {
      installSkill({ pkgName, skillSrc, destDir: p.trim() });
      rl.close();
    });
    return;
  } else {
    console.error('Invalid choice.');
    rl.close();
    process.exit(1);
  }
  installSkill({ pkgName, skillSrc, destDir });
  rl.close();
});
