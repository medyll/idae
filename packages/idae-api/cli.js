#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkgJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
const packageName = pkgJson.name.replace(/^@[^/]+\//, '');
const cmd = process.argv[2];

if (cmd === 'get-readme') {
	const readmePath = path.join(__dirname, 'README.md');
	if (fs.existsSync(readmePath)) {
		const content = fs.readFileSync(readmePath, 'utf8');
		console.log(content);
	} else {
		console.error('README.md not found in this package.');
		process.exit(1);
	}
} else {
	console.log('Usage: <cli> get-readme');
	process.exit(1);
}
