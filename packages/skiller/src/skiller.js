#!/usr/bin/env node
/**
 * Skiller CLI - Commands for @medyll/skiller itself
 * Usage: npx @medyll/skiller install-skill
 */
import { Command } from 'commander';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { version } = require('../package.json');

const program = new Command();

program
  .name('skiller')
  .description('Skill installer for @medyll packages - skiller commands')
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

program.parse();
