#!/usr/bin/env node
/**
 * Skiller Test CLI - Commands for testing and evaluating skills
 * Usage: npx @medyll/skiller test-skill, report, optimize
 */
import { Command } from 'commander';
import path from 'path';
import fs from 'fs';
import { createRequire } from 'module';
import { findPackageJson, getPackageName, findSkillMd } from './index.mjs';

const require = createRequire(import.meta.url);
const { version } = require('../package.json');
import { testSkill, findTestSuite } from './cli/tests/test-skill.js';
import { viewReport } from './cli/tests/view-report.js';
import { optimizeSkill } from './cli/tests/optimize.js';

const program = new Command();

program
  .name('skiller-test')
  .description('Skill evaluation and optimization for @medyll packages')
  .version(version);

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
