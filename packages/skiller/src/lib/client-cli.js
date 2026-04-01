#!/usr/bin/env node
/**
 * Skiller Client CLI - Commands for managing package skills
 * Usage: npx @medyll/skiller add-skill, create-skill
 */
import { Command } from 'commander';
import path from 'path';
import { createRequire } from 'module';
import { findPackageJson, getPackageName, findSkillMd, interactivePrompt, createSkill } from './index.mjs';

const require = createRequire(import.meta.url);
const { version } = require('../../package.json');

const program = new Command();

program
  .name('skiller-client')
  .description('Skill management for @medyll packages')
  .version(version);

// Default command: install skill for current package (interactive)
program
  .command('add-skill', { isDefault: true })
  .description('Install the skill for the current package (interactive) in the user\'s directory')
  .action(async () => {
    const cwd = process.cwd();
    const pkgJsonPath = findPackageJson(cwd);

    if (!pkgJsonPath) {
      console.error('No package.json found.');
      process.exit(1);
    }

    const pkgDir = path.dirname(pkgJsonPath);
    const pkgName = getPackageName(pkgJsonPath);
    const skillSrc = findSkillMd(pkgDir);

    if (!skillSrc) {
      console.error(`No SKILL.md found for "${pkgName}" (searched lib/skill/, dist/skill/, src/lib/skill/, and package root).`);
      console.error('Run "npx skiller create-skill" first to create a SKILL.md template.');
      process.exit(1);
    }

    await interactivePrompt({ pkgName, skillSrc });
  });

// Create a new skill template
program
  .command('create-skill')
  .description('Create a new SKILL.md template for the current package')
  .option('-n, --name <name>', 'Package name (default: from package.json)')
  .option('-d, --description <description>', 'Skill description for frontmatter')
  .action((options) => {
    const cwd = process.cwd();
    const pkgJsonPath = findPackageJson(cwd);

    if (!pkgJsonPath) {
      console.error('No package.json found.');
      process.exit(1);
    }

    const pkgDir = path.dirname(pkgJsonPath);
    const pkgName = options.name || getPackageName(pkgJsonPath);
    const description = options.description || '';

    createSkill({ pkgName, pkgDir, description });
  });

program.parse();
