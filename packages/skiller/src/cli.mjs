#!/usr/bin/env node
import { Command } from 'commander';
import path from 'path';
import fs from 'fs';
import { createRequire } from 'module';
import { findPackageJson, getPackageName, findSkillMd, interactivePrompt, createSkill } from './index.mjs';

const require = createRequire(import.meta.url);
const { version } = require('../package.json');
import { testSkill, findTestSuite } from './lib/cli/tests/test-skill.js';
import { viewReport } from './lib/cli/tests/view-report.js';
import { optimizeSkill } from './lib/cli/tests/optimize.js';

const program = new Command();

program
  .name('skiller')
  .description('Skill installer and creator for @medyll packages')
  .version(version);

// Install skiller's own skill to %USERPROFILE% / editor target
program
  .command('install-skill')
  .description('Install skiller\'s own SKILL.md to your AI agent (interactive by default)')
  .option('-t, --target <target>', 'Installation target (user, claude, cursor, etc.)')
  .action(async (options) => {
    if (options.target) {
      const { installSkillerSkill } = await import('./lib/cli/install-skiller.js');
      installSkillerSkill(options.target);
    } else {
      const { installSkillerInteractive } = await import('./lib/cli/install-skiller.js');
      await installSkillerInteractive();
    }
  });

// Default command: install skill for current package (interactive)
program
  .command('add-skill', { isDefault: true })
  .description('Install the skill for the current package (interactive)')
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

// Test skill command
program
  .command('test-skill')
  .description('Run tests defined in test-suite.json against multiple models')
  .option('-m, --model <model>', 'Specific model to test (e.g., claude, qwen, ollama)')
  .option('-c, --case <caseId>', 'Specific test case to run')
  .option('-p, --parallel', 'Run tests in parallel mode')
  .action((options) => {
    const cwd = process.cwd();
    const pkgJsonPath = findPackageJson(cwd);

    if (!pkgJsonPath) {
      console.error('No package.json found.');
      process.exit(1);
    }

    const pkgDir = path.dirname(pkgJsonPath);
    const pkgName = getPackageName(pkgJsonPath);
    const skillSrc = findSkillMd(pkgDir, pkgName);
    const testSuitePath = findTestSuite(pkgDir, pkgName);

    if (!skillSrc) {
      console.error(`No SKILL.md found for "${pkgName}"`);
      console.error('Run "npx skiller create-skill" first to create a SKILL.md template.');
      process.exit(1);
    }

    if (!testSuitePath) {
      console.error(`No test-suite.json found for "${pkgName}"`);
      console.error('Run "npx skiller create-skill" to generate one.');
      process.exit(1);
    }

    testSkill({ pkgName, skillSrc, testSuite: testSuitePath, model: options.model, caseId: options.case, parallel: options.parallel });
  });

// View report command
program
  .command('report')
  .description('Open evaluation results in browser')
  .option('-s, --session <session>', 'Session name/timestamp (defaults to latest)')
  .action((options) => {
    viewReport({ session: options.session });
  });

// Optimize command
program
  .command('optimize')
  .description('Use AI to analyze failures and suggest optimizations')
  .option('-s, --skill <skill>', 'Package/skill name (auto-detected if not provided)')
  .option('-m, --model <model>', 'Model to use for optimization (default: claude)', 'claude')
  .option('--dry-run', 'Show suggestions without applying them')
  .action((options) => {
    const cwd = process.cwd();
    const pkgJsonPath = findPackageJson(cwd);

    if (!pkgJsonPath) {
      console.error('No package.json found.');
      process.exit(1);
    }

    const pkgDir = path.dirname(pkgJsonPath);
    const pkgName = options.skill || getPackageName(pkgJsonPath);
    const skillSrc = findSkillMd(pkgDir, pkgName);

    if (!skillSrc) {
      console.error(`No SKILL.md found for "${pkgName || options.skill}"`);
      process.exit(1);
    }

    optimizeSkill({ skill: pkgName, skillSrc, model: options.model, dryRun: options.dryRun });
  });

program.parse();
