/**
 * migrate-legacy.ts — legacy MongoDB → canonical model migrator.
 *
 * CLI:
 *   npx tsx server/src/migrate/migrate-legacy.ts <org> <legacyUri> [--write] [--limit N] [--collections col1,col2]
 *
 *   --write               actually write (default: dry-run)
 *   --limit N             only process first N docs per collection
 *   --collections a,b     only migrate listed legacy collection names
 *   --target-uri <uri>    write target URI (default: same as legacyUri)
 */
import { config as dotenv } from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
// Load server/.env explicitly — cwd may differ when run from package root
dotenv({ path: resolve(fileURLToPath(import.meta.url), '../../../../../.env') });

import { MongoClient } from 'mongodb';
import type { OrgMapping, CollectionMap, FkResolve } from './mapping/types.js';
import type { MachineModel } from '../../../src/lib/types/machine-model.js';

// Auto-drop noise field pattern: creation/modification tracking + unix timestamps
const NOISE_RE = /^(date|heure)(creation|modification)/i;
const NOISE_TS = /^time[A-Z]/;   // timeCreationFoo, timeDebutFoo, etc.

interface Args {
	org:          string;
	legacyUri:    string;
	targetUri:    string;
	dryRun:       boolean;
	drop:         boolean;
	limit?:       number;
	collections?: string[];
}

function parseArgs(argv: string[]): Args {
	const pos   = argv.filter((a) => !a.startsWith('--'));
	const flags = argv.filter((a) => a.startsWith('--'));
	const limitFlag  = flags.find((f) => f.startsWith('--limit'));
	const colFlag    = flags.find((f) => f.startsWith('--collections'));
	const targetFlag = flags.find((f) => f.startsWith('--target-uri'));
	const legacyUri  = pos[1];
	return {
		org:          pos[0],
		legacyUri,
		// Default target = same Mongo instance as source (typical single-server setup)
		targetUri:    targetFlag ? (targetFlag.split('=')[1] ?? argv[argv.indexOf(targetFlag) + 1]) : legacyUri,
		dryRun:       !flags.includes('--write'),
		drop:         flags.includes('--drop'),
		limit:        limitFlag ? Number(limitFlag.split('=')[1] ?? argv[argv.indexOf(limitFlag) + 1]) : undefined,
		collections:  colFlag   ? (colFlag.split('=')[1] ?? argv[argv.indexOf(colFlag) + 1]).split(',') : undefined,
	};
}

async function loadOrg(org: string): Promise<{ mapping: OrgMapping; model: MachineModel }> {
	const mapping = (await import(`./mapping/${org}.js`)).default as OrgMapping;
	const model   = (await import(`../models/${org}/${org}Scheme.js`))[`${org}Scheme`] as MachineModel;
	return { mapping, model };
}

/** Reverse index: canonical target name → first matching { legacyName, map }. */
function buildReverseMap(mapping: OrgMapping): Map<string, { legacyName: string; map: CollectionMap }> {
	const rev = new Map<string, { legacyName: string; map: CollectionMap }>();
	for (const [legacyName, map] of Object.entries(mapping)) {
		if (!rev.has(map.target)) rev.set(map.target, { legacyName, map });
	}
	return rev;
}

type FkLookupMap = Map<string | number, string>;

/**
 * Build id→code (or code→code) lookup for one legacy collection.
 * Uses pkField/codeField from the target collection's mapping.
 */
async function buildFkLookup(
	client:     MongoClient,
	org:        string,
	legacyName: string,
	sourceDb:   string,
	pkField:    string,
	codeField:  string,
	on:         'id' | 'code',
): Promise<FkLookupMap> {
	const db   = client.db(`${org}_${sourceDb}`);
	const proj: Record<string, 1> = { [pkField]: 1, [codeField]: 1 };
	const docs = await db.collection(legacyName).find({}, { projection: proj }).toArray();
	const map: FkLookupMap = new Map();
	for (const doc of docs) {
		const key = on === 'id' ? (doc[pkField]  as string | number)
		                        : (doc[codeField] as string);
		// Use || not ?? so empty string also falls back to String(pkField)
		const val = (doc[codeField] as string) || String(doc[pkField] ?? '');
		if (key !== undefined && key !== null) map.set(key, val);
	}
	return map;
}

function coerceValue(value: unknown, type: string): unknown {
	if (value === null || value === undefined) return value;
	switch (type) {
		case 'boolean':
			if (typeof value === 'boolean') return value;
			if (typeof value === 'number')  return value !== 0;
			if (typeof value === 'string')  return value === '1' || value.toLowerCase() === 'true';
			return Boolean(value);
		case 'date':
			if (value instanceof Date) return value;
			if (typeof value === 'string' || typeof value === 'number') {
				const d = new Date(value as string | number);
				return isNaN(d.getTime()) ? null : d;
			}
			return value;
		case 'number':
		case 'currency':
			if (typeof value === 'number') return value;
			if (typeof value === 'string') {
				const n = Number(value.replace(',', '.'));
				return isNaN(n) ? value : n;
			}
			return value;
		default:
			return value;
	}
}

function transformDoc(
	doc:       Record<string, unknown>,
	map:       CollectionMap,
	model:     MachineModel,
	fkLookups: Map<string, FkLookupMap>,
): Record<string, unknown> {
	const out      = {} as Record<string, unknown>;
	const drop     = new Set(map.drop ?? []);
	const pkField  = map.pkField  ?? 'id';
	const codeField= map.codeField ?? 'code';
	const fkFroms  = new Set(Object.values(map.fks ?? {}).map((r) => r.from));

	for (const [k, v] of Object.entries(doc)) {
		if (k === '_id') continue;
		if (drop.has(k)) continue;
		if (map.dropNoise && (NOISE_RE.test(k) || NOISE_TS.test(k) || k === 'updated_fields')) continue;

		// PK and code handled first — they always become `id` / `code`
		if (k === pkField) { out.id = v; continue; }
		if (k === codeField && codeField !== pkField) { out.code = v; continue; }

		// Skip FK source fields (handled below)
		if (fkFroms.has(k)) continue;

		const newKey   = map.fields?.[k] ?? k;
		const coerceType = map.typeCoerce?.[newKey] ?? map.typeCoerce?.[k];
		const modelType  = coerceType ?? model[map.target]?.fields?.[newKey]?.type;
		out[newKey] = modelType ? coerceValue(v, modelType) : v;
	}

	// Synthesize code = String(id) when codeField absent in doc
	if (!out.code && out.id !== undefined) out.code = String(out.id);

	// FK resolution
	for (const [fkKey, resolve] of Object.entries(map.fks ?? {})) {
		const rawVal = doc[resolve.from];
		if (rawVal === undefined || rawVal === null) continue;
		const on       = resolve.on ?? 'code';
		const cacheKey = `${resolve.collection}:${on}`;
		const lookup   = fkLookups.get(cacheKey);
		const code     = lookup?.get(rawVal as string | number);
		if (code !== undefined) {
			if (!out.fks) out.fks = {};
			(out.fks as Record<string, unknown>)[fkKey] = { code };
		} else {
			// Unresolved FK — keep raw value so nothing is silently lost
			out[resolve.from] = rawVal;
		}
	}

	return out;
}

async function main() {
	const args = parseArgs(process.argv.slice(2));
	if (!args.org || !args.legacyUri) {
		console.error('usage: migrate-legacy <org> <legacyUri> [--write] [--drop] [--limit N] [--collections col1,col2]');
		process.exit(1);
	}

	const { mapping, model } = await loadOrg(args.org);
	const revMap = buildReverseMap(mapping);

	const entries = Object.entries(mapping).filter(
		([k]) => !args.collections || args.collections.includes(k)
	);
	console.log(`[migrate] org=${args.org} dryRun=${args.dryRun} drop=${args.drop} limit=${args.limit ?? '∞'} collections=${entries.length}`);

	const source = new MongoClient(args.legacyUri);
	await source.connect();

	// Lazy FK lookup cache: key = "canonicalTarget:on"
	const fkCache = new Map<string, FkLookupMap>();

	async function resolveFkLookup(resolve: FkResolve): Promise<FkLookupMap> {
		const on       = resolve.on ?? 'code';
		const cacheKey = `${resolve.collection}:${on}`;
		if (fkCache.has(cacheKey)) return fkCache.get(cacheKey)!;
		const rev = revMap.get(resolve.collection);
		if (!rev) {
			console.warn(`  [warn] no reverse mapping for FK target "${resolve.collection}" — lookup skipped`);
			return new Map();
		}
		const lookup = await buildFkLookup(
			source, args.org,
			rev.legacyName,
			rev.map.sourceDb ?? 'sitebase_base',
			rev.map.pkField  ?? 'id',
			rev.map.codeField ?? 'code',
			on,
		);
		fkCache.set(cacheKey, lookup);
		return lookup;
	}

	const targetRaw = args.dryRun ? null : new MongoClient(args.targetUri);
	if (targetRaw) await targetRaw.connect();

	// increment DB: tracks auto_increment counters for IdaeDb (key = "collection:id")
	const incrementDbName = 'increment';

	try {
		for (const [legacyCol, map] of entries) {
			const sourceDb = map.sourceDb ?? 'sitebase_base';
			const db = source.db(`${args.org}_${sourceDb}`);

			// Pre-build FK lookups
			const fkLookups = new Map<string, FkLookupMap>();
			for (const resolve of Object.values(map.fks ?? {})) {
				const on       = resolve.on ?? 'code';
				const cacheKey = `${resolve.collection}:${on}`;
				fkLookups.set(cacheKey, await resolveFkLookup(resolve));
			}

			const cursor = db.collection(legacyCol).find({});
			if (args.limit) cursor.limit(args.limit);
			const docs = await cursor.toArray();

			let written = 0;
			let skipped = 0;

			if (!args.dryRun && targetRaw) {
				const targetBase = model[map.target]?.base ?? 'machine_base';
				const targetDb   = targetRaw.db(`${args.org}_${targetBase}`);
				const targetCol  = targetDb.collection(map.target);

				if (args.drop) {
					await targetCol.deleteMany({});
					console.log(`  [drop] ${map.target}`);
				}

				let maxId = 0;
				for (const rawDoc of docs) {
					const rec = transformDoc(rawDoc as Record<string, unknown>, map, model, fkLookups);
					try {
						await targetCol.replaceOne({ code: rec.code }, rec, { upsert: true });
						written++;
						if (typeof rec.id === 'number' && rec.id > maxId) maxId = rec.id;
					} catch (e) {
						console.warn(`  [skip] ${legacyCol}#${(rawDoc as any)[map.pkField ?? 'id']}: ${(e as Error).message}`);
						skipped++;
					}
				}

				// Sync auto_increment counter so IdaeDb doesn't collide on future creates
				if (maxId > 0) {
					const incDb  = targetRaw.db(incrementDbName);
					const incKey = `${map.target}:id`;
					// _id is a string key ("collection:id"), not an ObjectId
				await incDb.collection('auto_increment').updateOne(
						{ _id: incKey } as any,
						{ $max: { value: maxId } },
						{ upsert: true },
					);
				}
			} else {
				for (const rawDoc of docs) {
					const rec = transformDoc(rawDoc as Record<string, unknown>, map, model, fkLookups);
					console.log(`  [dry] ${legacyCol} → ${map.target}:`, JSON.stringify(rec).slice(0, 200));
				}
			}

			console.log(`  ${legacyCol} → ${map.target}: ${docs.length} read, ${args.dryRun ? 0 : written} written, ${skipped} skipped`);
		}
	} finally {
		await source.close();
		await targetRaw?.close();
	}
}

main().catch((e) => { console.error('[migrate] failed:', e); process.exit(1); });
