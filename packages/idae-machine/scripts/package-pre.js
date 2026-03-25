// Created scripts/package-pre.js

import { MakeLibIndex } from '../../shared/scripts/indexIfy.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

new MakeLibIndex().makeIndexFile();

// Generate demo-status.json — simple analyzer
try {
	const __dirname = path.dirname(fileURLToPath(import.meta.url));
	const demoDir = path.join(__dirname, '../src/lib/demo');
	const statusPath = path.join(demoDir, 'demo-status.json');

	const missingComponents = [];
	const warnings = [];

	// Check for required view components
	if (!fs.existsSync(path.join(demoDir, 'CollectionTable.svelte')))
		missingComponents.push('CollectionTable');
	if (!fs.existsSync(path.join(demoDir, 'CollectionCard.svelte')))
		missingComponents.push('CollectionCard');

	const ready = missingComponents.length === 0;
	const status = { missingComponents, warnings, ready, generatedAt: new Date().toISOString() };

	fs.writeFileSync(statusPath, JSON.stringify(status, null, 2), 'utf-8');
	console.log('✓ demo-status.json generated');
} catch (err) {
	console.warn('⚠ demo-status.json generation skipped:', err.message);
}
