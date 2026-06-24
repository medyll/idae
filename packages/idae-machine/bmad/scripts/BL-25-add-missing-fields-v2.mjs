#!/usr/bin/env node
// BL-25 v2 — fixes the v1 script's two bugs:
//  1. v1 guessed type from field NAME via regex, ignoring the real inline type
//     already declared in the business models (exactly the "silent text fallback"
//     anti-pattern BL-23's investigation warned against). v2 scans the 19 business
//     models directly and uses the most-frequent observed inline type.
//  2. v1's humanName() exploded ALL-CAPS names letter-by-letter (PHPSESSID -> "p h
//     p s e s s i d"). v2 leaves all-caps/acronym names alone.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const FIELD_DEFS_PATH = path.join(ROOT, 'server/src/idae/field-defs.ts');
const MISSING_FIELDS_PATH = path.join(__dirname, '../artifacts/BL-25-audit/missing-fields.json');

const { FieldList } = await import(pathToFileURL(path.join(ROOT, 'server/src/idae/field-defs.ts')).href);

const orgFiles = [
	'agile/agileScheme', 'blogcms/blogcmsScheme', 'boutique/boutiqueScheme', 'comix/comixScheme',
	'crfr/crfrScheme', 'demo/demoScheme', 'factory/factoryScheme', 'flix/flixScheme',
	'hippo/hippoScheme', 'hotelo/hoteloScheme', 'idaenext/idaenextScheme', 'iot/iotScheme',
	'jobber/jobberScheme', 'latent/latentScheme', 'ledger/ledgerScheme', 'master/masterScheme',
	'medbook/medbookScheme', 'restau/restauScheme', 'school/schoolScheme', 'tactac/tactacScheme'
];

const models = {};
for (const rel of orgFiles) {
	const mod = await import(pathToFileURL(path.join(ROOT, 'server/src/models', `${rel}.ts`)).href);
	const exportName = Object.keys(mod).find((k) => k.endsWith('Scheme'));
	models[rel] = mod[exportName];
}

const missingFields = JSON.parse(await fs.readFile(MISSING_FIELDS_PATH, 'utf8'));
const missingSet = new Set(missingFields);

// fieldName -> Map<observedType, count>
const observed = new Map();
for (const scheme of Object.values(models)) {
	for (const colDef of Object.values(scheme)) {
		const fields = colDef?.fields;
		if (!fields) continue;
		for (const [fieldName, fieldDef] of Object.entries(fields)) {
			if (!missingSet.has(fieldName)) continue;
			const inline = fieldDef?.type;
			if (inline === undefined) continue;
			if (!observed.has(fieldName)) observed.set(fieldName, new Map());
			const counts = observed.get(fieldName);
			counts.set(inline, (counts.get(inline) ?? 0) + 1);
		}
	}
}

function modeType(fieldName) {
	const counts = observed.get(fieldName);
	if (!counts || counts.size === 0) return 'text'; // genuinely never inline-typed anywhere — rare
	let best = null;
	let bestCount = -1;
	for (const [type, count] of [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
		if (count > bestCount) { best = type; bestCount = count; }
	}
	return best;
}

function humanName(name) {
	if (/^[A-Z0-9_]+$/.test(name)) {
		// All-caps / acronym-ish (PHPSESSID, N_ID) — don't explode letter-by-letter.
		return name.replace(/_/g, ' ').toLowerCase();
	}
	if (name.includes('_')) {
		return name.split('_').map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())).join(' ');
	}
	return name.replace(/([A-Z])/g, ' $1').toLowerCase().trim();
}

function inferGroup(type) {
	if (type === 'boolean') return 'flags';
	if (type === 'password') return 'security';
	if (type === 'json') return 'meta';
	if (type === 'id') return 'identity';
	if (['email', 'phone', 'url'].includes(type)) return 'contact';
	if (type === 'currency') return 'pricing';
	if (type === 'date' || type === 'datetime') return 'date';
	return 'data';
}

let withRealType = 0;
let fellBackToText = 0;
const lines = [];
for (const fieldName of missingFields) {
	if (fieldName in FieldList) continue; // safety: skip if already added by a prior run
	const type = modeType(fieldName);
	if (observed.has(fieldName)) withRealType++; else fellBackToText++;
	const group = inferGroup(type);
	const human = humanName(fieldName);
	const pad = Math.max(0, 18 - fieldName.length);
	lines.push(`\t${fieldName}:${' '.repeat(pad)}{
\t\tcode:        '${fieldName}',
\t\tname:        '${human.replace(/'/g, "\\'")}',
\t\ttype:        '${type}',
\t\tgroup:       '${group}',
\t\tdescription: ''
\t},`);
}

console.log(`Generating ${lines.length} entries (real type from model scan: ${withRealType}, fell back to 'text': ${fellBackToText})`);

const source = await fs.readFile(FIELD_DEFS_PATH, 'utf8');
const marker = '} as const satisfies Record<string, Partial<AppSchemeField>>;';
const idx = source.indexOf(marker);
if (idx === -1) throw new Error('marker not found');
const block = `\n\t// --- BL-25 Added Fields (v2 — real types from model scan) ---\n${lines.join('\n')}\n`;
const patched = source.slice(0, idx) + block + source.slice(idx);
await fs.writeFile(FIELD_DEFS_PATH, patched, 'utf8');
console.log('Written:', FIELD_DEFS_PATH);
