#!/usr/bin/env node

// Runner for idae-router tests.
// Removes extra args that can be injected by workspace runners
// and runs unit + e2e tests sequentially.

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

// Run unit tests (vitest) with --run if not already passed
const unitArgs = stripArgs(process.argv.slice(2));
if (!unitArgs.includes('--run')) unitArgs.push('--run');
run('pnpm', ['run', 'test:unit', '--', ...unitArgs]);

// Run e2e tests (playwright)
run('pnpm', ['run', 'test:e2e']);
