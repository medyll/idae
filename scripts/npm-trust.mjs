#!/usr/bin/env node
// Declare GitHub Actions (.github/workflows/release.yml) as the npm trusted
// publisher of every public workspace package, so release.yml publishes with
// OIDC instead of an NPM_TOKEN.
//
//   node scripts/npm-trust.mjs                 # every public package without a config
//   node scripts/npm-trust.mjs @medyll/idae-be  # only the listed packages
//   node scripts/npm-trust.mjs --dry-run
//
// Needs `npm login` first; npm asks for 2FA once (tick "skip 2FA for 5 minutes"
// to cover the whole loop). The package must already exist on npm, and npm
// expires a config that does not publish within 2 days: run this right before
// the release that will publish the package.
import { spawnSync } from 'node:child_process';

const NPM = ['-y', 'npm@11.21.3']; // `npm trust` needs npm >= 11.15
const REPO = 'medyll/idae';
const WORKFLOW = 'release.yml';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const only = new Set(args.filter((a) => !a.startsWith('--')));

function run(cmd, cmdArgs, opts = {}) {
	return spawnSync(cmd, cmdArgs, { shell: process.platform === 'win32', encoding: 'utf8', ...opts });
}

const listed = run('pnpm', ['ls', '-r', '--depth', '-1', '--json']);
if (listed.status !== 0) {
	console.error(listed.stderr || 'pnpm ls failed');
	process.exit(2);
}
const packages = JSON.parse(listed.stdout)
	.filter((p) => p.name && !p.private)
	.map((p) => p.name)
	.filter((name) => only.size === 0 || only.has(name));

let failed = 0;
for (const name of packages) {
	const existing = run('npx', [...NPM, 'trust', 'list', name, '--json']);
	if (existing.status === 0 && existing.stdout.includes(WORKFLOW)) {
		console.log(`= ${name}: already trusted`);
		continue;
	}
	console.log(`+ ${name}: trust ${REPO} / ${WORKFLOW}`);
	if (dryRun) continue;
	const res = run(
		'npx',
		[...NPM, 'trust', 'github', name, '--repo', REPO, '--file', WORKFLOW, '--allow-publish', '--yes'],
		{ stdio: 'inherit' }
	);
	if (res.status !== 0) failed += 1;
}
process.exit(failed ? 1 : 0);
