#!/usr/bin/env node
/**
 * Skiller CLI - Main entry point for @medyll/skiller
 * Usage: npx @medyll/skiller install-skill
 */
import { Command } from 'commander';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { version } = require('../../package.json');

const program = new Command();

program
  .name('skiller')
  .description('Skill installer and evaluator for @medyll packages')
  .version(version);

// Install skiller's own skill to editor target
program
  .command('install-skill')
  .description('Install skiller\'s own SKILL.md to your AI agent (interactive by default)')
  .option('-t, --target <target>', 'Installation target (user, claude, cursor, etc.)')
  .action(async (options) => {
    if (options.target) {
      const { installSkillerSkill } = await import('./install-skiller.js');
      installSkillerSkill(options.target);
    } else {
      const { installSkillerInteractive } = await import('./install-skiller.js');
      await installSkillerInteractive();
    }
  });

program.parse();
