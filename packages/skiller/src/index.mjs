import fs from 'fs';
import path from 'path';
import os from 'os';
import readline from 'readline';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const registry = require('./registry.json');

/**
 * Resolve a target path template to an absolute path
 * @param {string[]} template - Path template (e.g. ['homedir', '.claude', 'skills', '<pkg>'])
 * @param {string} pkgName - Package name to substitute for <pkg>
 * @param {string} cwd - Current working directory
 * @returns {string} Resolved absolute path
 */
export function resolveTargetPath(template, pkgName, cwd) {
  const parts = template.map(part => {
    if (part === 'homedir') return os.homedir();
    if (part === 'cwd') return cwd;
    if (part === '<pkg>') return pkgName;
    return part;
  });
  return path.join(...parts);
}

/**
 * Get all available installation targets
 * @returns {Object} Registry targets
 */
export function getTargets() {
  return registry.targets;
}

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
  const targets = Object.values(registry.targets);
  const custom = registry.custom;

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  console.log(`\nWhere to install the skill for ${pkgName}?`);
  
  targets.forEach((target, index) => {
    const displayPath = target.template.includes('<pkg>')
      ? path.join(...target.template.map(p => p === '<pkg>' ? pkgName : p === 'homedir' ? '~' : p === 'cwd' ? '.' : p), 'SKILL.md')
      : target.path;
    const marker = target.template.includes('cwd') ? '  (current project)' : '';
    console.log(`  ${index + 1}) ${target.label.padEnd(10)} → ${displayPath}${marker}`);
  });
  
  if (custom.enabled) {
    console.log(`  ${targets.length + 1}) ${custom.label.padEnd(10)} → ask for a custom path`);
  }
  console.log('');

  return new Promise((resolve, reject) => {
    rl.question(`Enter choice (1-${targets.length + (custom.enabled ? 1 : 0)}): `, (choice) => {
      const trimmed = choice.trim();
      const choiceNum = parseInt(trimmed, 10);
      let destDir;

      // Check if it's a valid target choice
      if (choiceNum >= 1 && choiceNum <= targets.length) {
        const target = targets[choiceNum - 1];
        destDir = resolveTargetPath(target.template, pkgName, cwd);
      } else if (custom.enabled && choiceNum === targets.length + 1) {
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
 * @param {{ pkgName: string, skillSrc: string, target: string }} options
 */
export function installSkillNonInteractive({ pkgName, skillSrc, target }) {
  const cwd = process.cwd();
  let destDir;

  const targetConfig = registry.targets[target];
  if (targetConfig) {
    destDir = resolveTargetPath(targetConfig.template, pkgName, cwd);
  } else {
    // Custom path
    destDir = target;
  }

  installSkill({ pkgName, skillSrc, destDir });
}

/**
 * Create a test-suite.json template
 * @param {{ pkgName: string, pkgDir: string }} options
 * @returns {string} Path to created test-suite.json
 */
export function createTestSuite({ pkgName, pkgDir }) {
  const skillDir = path.join(pkgDir, 'lib', 'skill', pkgName);
  const testSuiteFile = path.join(skillDir, 'test-suite.json');

  fs.mkdirSync(skillDir, { recursive: true });

  const template = {
    skill: pkgName,
    version: '1.0.0',
    cases: [
      {
        id: 'case-001',
        name: 'Basic Functionality',
        input: `How do I use ${pkgName}?`,
        expectations: ['contains installation steps', 'shows core API'],
        assertions: {
          min_length: 100,
          format: 'markdown',
          required_keywords: ['install', 'usage']
        }
      },
      {
        id: 'case-002',
        name: 'Advanced Usage',
        input: 'Can you show me an example with options?',
        expectations: ['shows code example', 'explains parameters'],
        assertions: {
          min_length: 200,
          contains_code: true
        }
      }
    ],
    models: ['claude', 'qwen', 'ollama'],
    settings: {
      timeout: 30000,
      parallel: true
    }
  };

  fs.writeFileSync(testSuiteFile, JSON.stringify(template, null, 2), 'utf8');
  console.log(`\ntest-suite.json created: ${testSuiteFile}`);
  return testSuiteFile;
}

/**
 * Updated createSkill to also create test-suite.json
 * @param {{ pkgName: string, pkgDir: string, description?: string }} options
 * @returns {{ skillFile: string, testSuiteFile: string }} Paths to created files
 */
export function createSkillWithTests({ pkgName, pkgDir, description = '' }) {
  const skillFile = createSkill({ pkgName, pkgDir, description });
  const testSuiteFile = createTestSuite({ pkgName, pkgDir });
  return { skillFile, testSuiteFile };
}
