import fs from 'fs';
import path from 'path';
import os from 'os';
import readline from 'readline';

/**
 * Find the nearest package.json from a directory
 * @param {string} dir - Starting directory
 * @returns {string|null} Path to package.json or null
 */
export function findPackageJson(dir) {
  const candidate = path.join(dir, 'package.json');
  if (fs.existsSync(candidate)) return candidate;
  const parent = path.dirname(dir);
  if (parent === dir) return null;
  return findPackageJson(parent);
}

/**
 * Find SKILL.md in standard locations
 * Standard paths: src/lib/skill/<pkg>/SKILL.md or dist/skill/<pkg>/SKILL.md
 * @param {string} pkgDir - Package directory
 * @param {string} [pkgName] - Optional package name (auto-detected if not provided)
 * @returns {string|null} Path to SKILL.md or null
 */
export function findSkillMd(pkgDir, pkgName) {
  // Auto-detect package name if not provided
  if (!pkgName) {
    const pkgJsonPath = findPackageJson(pkgDir);
    if (pkgJsonPath) {
      pkgName = getPackageName(pkgJsonPath);
    }
  }
  
  const candidates = pkgName ? [
    path.join(pkgDir, 'src', 'lib', 'skill', pkgName, 'SKILL.md'),
    path.join(pkgDir, 'dist', 'skill', pkgName, 'SKILL.md'),
    path.join(pkgDir, 'lib', 'skill', pkgName, 'SKILL.md'),
    path.join(pkgDir, 'SKILL.md'),
  ] : [
    path.join(pkgDir, 'SKILL.md'),
  ];
  
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

/**
 * Install a skill to a destination directory
 * @param {{ pkgName: string, skillSrc: string, destDir: string }} options
 */
export function installSkill({ pkgName, skillSrc, destDir }) {
  const destFile = path.join(destDir, 'SKILL.md');
  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(skillSrc, destFile);
  console.log(`\nSkill installed: ${destFile}`);
}

/**
 * Create a new SKILL.md file with frontmatter template
 * @param {{ pkgName: string, pkgDir: string, description?: string }} options
 * @returns {string} Path to created SKILL.md
 */
export function createSkill({ pkgName, pkgDir, description = '' }) {
  const skillDir = path.join(pkgDir, 'lib', 'skill', pkgName);
  const skillFile = path.join(skillDir, 'SKILL.md');
  
  fs.mkdirSync(skillDir, { recursive: true });
  
  const template = `---
name: ${pkgName}
description: ${description || `Use this when you need ${pkgName} functionality.`}
---

## Overview
${description || 'TODO: Add overview description'}

## Install
\`\`\`bash
pnpm add @medyll/${pkgName}
\`\`\`

## Core API
TODO: Add core API documentation

## Usage
\`\`\`ts
// TODO: Add usage examples
\`\`\`
`;
  
  fs.writeFileSync(skillFile, template, 'utf8');
  console.log(`\nSKILL.md created: ${skillFile}`);
  return skillFile;
}

/**
 * Get package name from package.json
 * @param {string} pkgJsonPath - Path to package.json
 * @returns {string} Package name without scope
 */
export function getPackageName(pkgJsonPath) {
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
  return (pkgJson.name || path.basename(path.dirname(pkgJsonPath))).replace(/^@[^/]+\//, '');
}

/**
 * Run interactive prompt to select installation target
 * @param {{ pkgName: string, skillSrc: string }} options
 */
export async function interactivePrompt({ pkgName, skillSrc }) {
  const cwd = process.cwd();
  
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  
  console.log(`\nWhere to install the skill for ${pkgName}?`);
  console.log(`  1) user     → ${path.join(os.homedir(), '.claude', 'skills', pkgName, 'SKILL.md')}`);
  console.log(`  2) claude   → ${path.join(cwd, '.claude', 'skills', pkgName, 'SKILL.md')}  (current project)`);
  console.log(`  3) codex    → ${path.join(os.homedir(), '.codex', 'skills', pkgName, 'SKILL.md')}`);
  console.log(`  4) agent    → ${path.join(cwd, '.github', 'skills', pkgName, 'SKILL.md')}  (current project)`);
  console.log(`  5) custom   → ask for a custom path`);
  console.log('');
  
  return new Promise((resolve, reject) => {
    rl.question('Enter choice (1-5): ', (choice) => {
      const trimmed = choice.trim();
      let destDir;
      if (trimmed === '1') {
        destDir = path.join(os.homedir(), '.claude', 'skills', pkgName);
      } else if (trimmed === '2') {
        destDir = path.join(cwd, '.claude', 'skills', pkgName);
      } else if (trimmed === '3') {
        destDir = path.join(os.homedir(), '.codex', 'skills', pkgName);
      } else if (trimmed === '4') {
        destDir = path.join(cwd, '.github', 'skills', pkgName);
      } else if (trimmed === '5') {
        rl.question('Enter custom destination directory: ', (p) => {
          installSkill({ pkgName, skillSrc, destDir: p.trim() });
          rl.close();
          resolve();
        });
        return;
      } else {
        console.error('Invalid choice.');
        rl.close();
        reject(new Error('Invalid choice'));
        return;
      }
      installSkill({ pkgName, skillSrc, destDir });
      rl.close();
      resolve();
    });
  });
}

/**
 * Install skill non-interactively
 * @param {{ pkgName: string, skillSrc: string, target: 'user' | 'claude' | 'codex' | 'agent' | string }} options
 */
export function installSkillNonInteractive({ pkgName, skillSrc, target }) {
  const cwd = process.cwd();
  let destDir;
  
  switch (target) {
    case 'user':
      destDir = path.join(os.homedir(), '.claude', 'skills', pkgName);
      break;
    case 'claude':
      destDir = path.join(cwd, '.claude', 'skills', pkgName);
      break;
    case 'codex':
      destDir = path.join(os.homedir(), '.codex', 'skills', pkgName);
      break;
    case 'agent':
      destDir = path.join(cwd, '.github', 'skills', pkgName);
      break;
    default:
      destDir = target;
  }
  
  installSkill({ pkgName, skillSrc, destDir });
}
