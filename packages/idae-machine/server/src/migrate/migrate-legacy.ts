/**
 * migrate-legacy.ts — reusable legacy MongoDB → canonical model migrator (SKELETON).
 *
 * Reads docs from a legacy `<org>_sitebase_*` database, transforms them with the
 * org mapping (`./mapping/<org>.ts`) + the canonical model (`<org>Scheme`), and
 * writes into the new `{org}_machine_*` databases via IdaeDb.
 *
 * Status: SKELETON. Transform/fk-resolution/AI hook are stubs — wire them as the
 * actual migration is needed (the three orgs need no data for now).
 *
 * CLI:
 *   npx tsx server/src/migrate/migrate-legacy.ts <org> <legacyUri> [--dry-run] [--limit N]
 *
 *   <org>        crfr | idaenext | tactac
 *   <legacyUri>  mongodb URI of the legacy source
 *   --dry-run    log transforms, write nothing (default ON until explicitly --write)
 *   --limit N    only process first N docs per collection (sampling)
 */
import { MongoClient } from 'mongodb';
import { IdaeDb, DbType } from '@medyll/idae-db';
import type { OrgMapping, CollectionMap } from './mapping/types.js';
import type { MachineModel } from '../../../src/lib/types/machine-model.js';

interface Args { org: string; legacyUri: string; dryRun: boolean; limit?: number }

function parseArgs(argv: string[]): Args {
	const pos = argv.filter((a) => !a.startsWith('--'));
	const flags = argv.filter((a) => a.startsWith('--'));
	const limitFlag = flags.find((f) => f.startsWith('--limit'));
	return {
		org:       pos[0],
		legacyUri: pos[1],
		dryRun:    !flags.includes('--write'),         // safe default: dry-run unless --write
		limit:     limitFlag ? Number(limitFlag.split('=')[1] ?? argv[argv.indexOf(limitFlag) + 1]) : undefined,
	};
}

/** Dynamically load the org mapping + canonical model. */
async function loadOrg(org: string): Promise<{ mapping: OrgMapping; model: MachineModel }> {
	const mapping = (await import(`./mapping/${org}.js`)).default as OrgMapping;
	const model   = (await import(`../models/${org}/${org}Scheme.js`))[`${org}Scheme`] as MachineModel;
	return { mapping, model };
}

/**
 * AI hook (STUB). When the static mapping has no rule for a field, an LLM can
 * propose rename + type from the legacy value + target model. Reusable across orgs.
 * TODO: wire to an Anthropic call; return `{}` keeps the migrator deterministic for now.
 */
async function inferMapping(
	_legacyDoc: Record<string, unknown>,
	_target: CollectionMap,
	_model: MachineModel,
): Promise<{ fields?: Record<string, string>; types?: Record<string, string> }> {
	return {}; // no-op until the AI hook is enabled
}

/** Transform one legacy doc into a canonical record using the mapping. */
function transformDoc(doc: Record<string, unknown>, map: CollectionMap): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	const drop = new Set(map.drop ?? []);
	for (const [k, v] of Object.entries(doc)) {
		if (k === '_id' || drop.has(k)) continue;
		const newKey = map.fields?.[k] ?? k;
		out[newKey] = v;
	}
	// TODO: fk resolution — for each map.fks, look up target by `on` key and emit fks.<col>.code
	// TODO: typeCoerce — coerce string→Date/number/boolean per map.typeCoerce / model field type
	return out;
}

async function main() {
	const args = parseArgs(process.argv.slice(2));
	if (!args.org || !args.legacyUri) {
		console.error('usage: migrate-legacy <org> <legacyUri> [--write] [--limit N]');
		process.exit(1);
	}

	const { mapping, model } = await loadOrg(args.org);
	console.log(`[migrate] org=${args.org} dryRun=${args.dryRun} limit=${args.limit ?? '∞'} collections=${Object.keys(mapping).length}`);

	const source = new MongoClient(args.legacyUri);
	await source.connect();

	// Target — same IdaeDb scoping convention as deployModel.ts
	const target = IdaeDb.init(
		process.env.MONGODB_URI ?? 'mongodb://localhost:27017',
		{
			dbType:           DbType.MONGODB,
			dbScope:          args.org,
			dbScopeSeparator: '_',
			idaeModelOptions: { autoIncrementFormat: () => 'id', autoIncrementDbCollection: 'auto_increment' },
		},
	);

	try {
		for (const [legacyCol, map] of Object.entries(mapping)) {
			// Legacy db/collection naming varies per org — adjust source.db()/collection() here.
			const srcDb  = source.db();                       // TODO: pick legacy db (e.g. `${org}_sitebase_base`)
			const cursor = srcDb.collection(legacyCol).find({});
			if (args.limit) cursor.limit(args.limit);
			const docs = await cursor.toArray();

			let written = 0;
			for (const doc of docs) {
				const inferred = await inferMapping(doc, map, model);
				if (inferred.fields) map.fields = { ...inferred.fields, ...map.fields };
				const rec = transformDoc(doc, map);

				if (args.dryRun) {
					console.log(`  [dry] ${legacyCol} → ${map.target}:`, JSON.stringify(rec).slice(0, 160));
				} else {
					await target.collection(map.target).create(rec);
					written++;
				}
			}
			console.log(`  ${legacyCol} → ${map.target}: ${docs.length} read, ${args.dryRun ? 0 : written} written`);
		}
	} finally {
		await source.close();
	}
}

main().catch((e) => { console.error('[migrate] failed:', e); process.exit(1); });
