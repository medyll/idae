import { IndexGenerator } from './make-export.js';
import { COMPONENT_ROOTS, EXCLUDE_GLOBS } from './make-export.js';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Generate exports index
await new IndexGenerator(COMPONENT_ROOTS, EXCLUDE_GLOBS).generate();

// Generate registry and pnpx summary so packaging includes up-to-date registry
try {
	const genScript = path.join(__dirname, 'generate-registry-from-lib.cjs');
	const makeScript = path.join(__dirname, 'make-pnpx.cjs');

	if (genScript) {
		console.log('Running registry generator...');
		execSync(`${process.execPath} "${genScript}"`, { stdio: 'inherit' });
	}

	if (makeScript) {
		console.log('Running pnpx summary generator...');
		execSync(`${process.execPath} "${makeScript}"`, { stdio: 'inherit' });
	}
} catch (e) {
	console.error('Warning: registry generation failed (continuing packaging):', e && e.message ? e.message : e);
}

