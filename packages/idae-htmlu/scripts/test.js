#!/usr/bin/env node

import { spawnSync } from 'node:child_process';

const stripArgs = (args) => args.filter((a) => a !== '--if-present');

const run = (cmd, args) => {
  const result = spawnSync(cmd, args, { stdio: 'inherit' });
  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }
  if (result.status !== 0) process.exit(result.status);
};

// Run integration tests first
run('npm', ['run', 'test:integration']);

// Run unit tests (allow pnpm to pass --if-present, but strip it)
const unitArgs = stripArgs(process.argv.slice(2));
if (!unitArgs.includes('--run')) unitArgs.push('--run');
run('npm', ['run', 'test:unit', '--', ...unitArgs]);
