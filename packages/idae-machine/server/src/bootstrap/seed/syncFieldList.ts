/**
 * syncFieldList.ts — FieldList sync utility
 *
 * Scans all model declarations, collects every field name, compares to FieldList.
 * For any name missing from FieldList: infers type + generates entry, then patches
 * server/src/idae/field-defs.ts in place.
 *
 * Usage:
 *   npx tsx server/src/bootstrap/seed/syncFieldList.ts [--dry-run] [--verbose]
 *
 * Options:
 *   --dry-run   Print missing fields without writing anything
 *   --verbose   Print every field checked (hit or miss)
 *
 * Returns exit 0 always (designed to run as a pre-build check or standalone).
 * If new entries were added, file is modified in place.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ── Paths ──────────────────────────────────────────────────────────────────────
const __dirname    = path.dirname(fileURLToPath(import.meta.url));
const ROOT         = path.resolve(__dirname, '../../../..');
const FIELD_DEFS   = path.join(ROOT, 'server/src/idae/field-defs.ts');

// ── Args ───────────────────────────────────────────────────────────────────────
const DRY_RUN = process.argv.includes('--dry-run');
const VERBOSE = process.argv.includes('--verbose');

// RBAC single-letter permission ops — real fields, not artefacts
const RBAC_OPS = new Set(['c', 'r', 'u', 'd', 'l', 'x']);

// ── Field name filter — skip likely non-field keys ───────────────────────────
function isLikelyField(name: string): boolean {
	if (RBAC_OPS.has(name)) return true;            // RBAC ops are real fields
	if (name.length < 2) return false;              // other single-letter keys = config artefact
	if (/^[A-Z_]+$/.test(name)) return false;       // ALL_CAPS = constants
	if (/^[0-9]/.test(name)) return false;           // starts with digit
	return true;
}

// ── inferType (mirrors idaeModel.ts exactly) ────────────────────────────────
function inferType(name: string): string {
	if (RBAC_OPS.has(name))                                                                  return 'boolean';
	if (name === 'id')                                                                       return 'id';
	if (/(At|^timestamp$|^startedAt$|^expiresAt$|^lastActivityAt$|^performedAt$|^lockedUntil$|^validFrom$|^validUntil$|^assignedAt$|^revokedAt$|^grantedAt$)/.test(name)) return 'datetime';
	if (/^(is|has|can|must|emailVerified)/.test(name))                                       return 'boolean';
	if (name.endsWith('Hash') || name === 'password')                                        return 'password';
	if (['preferences','deviceInfo','options','_views','appPermissions','constraints','details','changes','metadata','fks'].includes(name)) return 'json';
	if (['order','roleLevel','failedLoginCount','resourceId','sessionId','assignedBy','revokedBy','grantedBy','actorId',
	     'count','rating','token_count','max_tokens'].includes(name)) return 'number';
	return 'text';
}

// ── inferGroup — best-effort grouping ────────────────────────────────────────
function inferGroup(name: string, type: string): string {
	if (RBAC_OPS.has(name))                                                              return 'rbac';
	if (['actorId','changes','createdBy','updatedBy','version','scheme'].includes(name)) return 'audit';
	if (type === 'datetime' || name.endsWith('At'))                                      return 'date';
	if (type === 'boolean')                                                              return 'flags';
	if (type === 'password')                                                             return 'security';
	if (type === 'json')                                                                 return 'meta';
	if (type === 'id' || name === 'code' || name === 'name')                             return 'identity';
	return 'data';
}

// ── humanName — camelCase → "lower case words" ────────────────────────────────
function humanName(name: string): string {
	return name.replace(/([A-Z])/g, ' $1').toLowerCase().trim();
}

// ── Collect field names from a model declaration object (recursive) ──────────
function collectFields(obj: unknown, acc: Set<string> = new Set()): Set<string> {
	if (!obj || typeof obj !== 'object') return acc;
	const rec = obj as Record<string, unknown>;
	if ('fields' in rec && rec.fields && typeof rec.fields === 'object') {
		for (const k of Object.keys(rec.fields as object)) acc.add(k);
	}
	for (const v of Object.values(rec)) collectFields(v, acc);
	return acc;
}

// ── Load models dynamically ───────────────────────────────────────────────────
async function loadModels(): Promise<Set<string>> {
	const all = new Set<string>();

	// 1. Engine core
	const { idaeModelCore } = await import('../../idae/index.js');
	collectFields(idaeModelCore, all);

	// 2. Any *Scheme.ts / *Model.ts in server/src/bootstrap/seed/ (future-proof)
	const seedDir = path.join(__dirname);
	const extras = fs.readdirSync(seedDir).filter(f =>
		/\.(ts|js)$/.test(f) &&
		!['syncFieldList.ts','syncFieldList.js','idaeModel.ts','idaeModel.js',
		  'schemaWalker.ts','schemaWalker.js',
		  'schemaWalker.test.ts'].includes(f)
	);
	for (const file of extras) {
		try {
			const mod = await import(path.join(seedDir, file));
			for (const val of Object.values(mod)) collectFields(val, all);
		} catch {
			// non-importable (e.g. missing deps) — skip silently
		}
	}

	return all;
}

// ── Load current FieldList keys from source (regex — no eval needed) ─────────
function loadFieldListKeys(): Set<string> {
	const src       = fs.readFileSync(FIELD_DEFS, 'utf8');
	const declStart = src.indexOf('export const FieldList = {');
	const closeIdx  = src.indexOf('\n} as const satisfies Record<string, Partial<AppSchemeField>>;', declStart);
	if (declStart === -1 || closeIdx === -1) throw new Error('Could not locate FieldList declaration');
	const body = src.slice(declStart, closeIdx);
	// Lines like:  	email:           {
	const keys = new Set<string>();
	for (const m of body.matchAll(/^\t([a-zA-Z_][a-zA-Z0-9_]*):\s*\{/gm)) {
		keys.add(m[1]);
	}
	return keys;
}

// ── Generate TS entry for a missing field ────────────────────────────────────
function generateEntry(name: string): string {
	const type  = inferType(name);
	const group = inferGroup(name, type);
	const human = humanName(name);
	// Pad key to 18 chars for alignment
	const pad   = Math.max(0, 18 - name.length);
	const key   = `${name}:${' '.repeat(pad)}`;
	return [
		`\t${key}{`,
		`\t\tcode:        '${name}',`,
		`\t\tname:        '${human}',`,
		`\t\ttype:        '${type}',`,
		`\t\tgroup:       '${group}',`,
		`\t\tdescription: ''`,
		`\t},`,
	].join('\n');
}

// ── Patch field-defs.ts — insert before closing "};" of FieldList ────────────
function patchFieldDefs(entries: string[]): void {
	const src        = fs.readFileSync(FIELD_DEFS, 'utf8');
	const declStart  = src.indexOf('export const FieldList = {');
	if (declStart === -1) throw new Error('Could not locate `export const FieldList = {` declaration');
	const closeIdx   = src.indexOf('\n} as const satisfies Record<string, Partial<AppSchemeField>>;', declStart);
	if (closeIdx === -1) throw new Error('Could not locate closing `};` of FieldList');

	// group new entries under // SYNCED comment
	const block = [
		'',
		'\t// SYNCED — auto-generated by syncFieldList.ts',
		...entries,
	].join('\n');

	const patched = src.slice(0, closeIdx) + block + '\n' + src.slice(closeIdx + 1);
	fs.writeFileSync(FIELD_DEFS, patched, 'utf8');
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
	console.log('[syncFieldList] scanning models…');

	const modelFields   = await loadModels();
	const fieldListKeys = loadFieldListKeys();

	const missing: string[] = [];

	for (const name of [...modelFields].filter(isLikelyField).sort()) {
		if (fieldListKeys.has(name)) {
			if (VERBOSE) console.log(`  ✓  ${name}`);
		} else {
			const type = inferType(name);
			console.log(`  ✗  ${name}  →  type:${type} (inferred)`);
			missing.push(name);
		}
	}

	console.log(`\n[syncFieldList] ${modelFields.size} fields scanned, ${missing.length} missing from FieldList`);

	if (missing.length === 0) {
		console.log('[syncFieldList] FieldList is complete. Nothing to do.');
		return;
	}

	if (DRY_RUN) {
		console.log('[syncFieldList] --dry-run: no file written.');
		return;
	}

	const entries = missing.map(generateEntry);
	patchFieldDefs(entries);
	console.log(`[syncFieldList] Patched ${FIELD_DEFS}`);
	console.log('[syncFieldList] Review added entries — fill in description fields as needed.');
}

main().catch(e => { console.error(e); process.exit(1); });
