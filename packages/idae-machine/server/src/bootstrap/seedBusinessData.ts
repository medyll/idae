/**
 * seedBusinessData — inserts business data rows into MongoDB.
 * Idempotent: skips any collection that already has documents.
 *
 * Routes each collection to the DB derived from its declared `base` field
 * in the MachineModel (e.g. base='machine_base' → {org}_machine_base).
 * Falls back to 'machine_user' if model entry has no base.
 *
 * Builds fks.{relation}_{id} denorm entries using foldFks with an in-memory
 * Map resolver. Insertion order must put referentials before dependents.
 */
import type { Connection } from 'mongoose';
import { mongooseConnectionManager } from '@medyll/idae-api';
import type { MachineModel } from '../../../src/lib/types/machine-model.js';
import { foldFks, type FkResolver } from '../validation/FkFolder.js';

const DEFAULT_BASE = 'machine_user';

export interface SeedBusinessOpts {
	org:       string;
	mongoUri:  string;
	model:     MachineModel;
	data:      Record<string, unknown[]>;
	/**
	 * When true, wipe each seed collection before inserting. Without it the seed
	 * is idempotent (skips populated collections) — which silently preserves
	 * stale data from an earlier seed convention. Use for a clean re-seed.
	 */
	clearFirst?: boolean;
}

/**
 * Seed business data rows into MongoDB, routing each collection to its
 * model-declared base database.
 */
export async function seedBusinessData(opts: SeedBusinessOpts): Promise<void> {
	const { org, mongoUri, model, data, clearFirst = false } = opts;
	const connCache = new Map<string, Connection>();

	async function getConn(base: string): Promise<Connection> {
		const dbName = `${org}_${base}`;
		let conn = connCache.get(dbName);
		if (!conn) {
			conn = await mongooseConnectionManager.getOrCreate(mongoUri, dbName);
			connCache.set(dbName, conn);
		}
		return conn;
	}

	// In-memory FK snapshot — built incrementally as each collection is seeded.
	// Referentials must appear before dependents in `data` (insertion order contract).
	const seedMap: Record<string, Map<number, Record<string, unknown>>> = {};

	function makeSeedResolver(): FkResolver {
		return async (targetCollection, scalarId) => {
			const map = seedMap[targetCollection];
			if (!map) return null;
			const numId = Number(scalarId);
			return map.get(numId) ?? null;
		};
	}

	for (const [collectionName, rows] of Object.entries(data)) {
		if (!rows || rows.length === 0) continue;

		const base = model[collectionName]?.base ?? DEFAULT_BASE;
		const conn = await getConn(base);
		const col  = conn.collection(collectionName);

		if (clearFirst) {
			const removed = await col.deleteMany({});
			if (removed.deletedCount) {
				console.log(`  [business] ${collectionName} → ${org}_${base} — cleared ${removed.deletedCount} stale docs`);
			}
		} else {
			const count = await col.countDocuments();
			if (count > 0) {
				console.log(`  [business] ${collectionName} → ${org}_${base} — already seeded (${count} docs), skipped`);
				// Still index already-present records so dependents can resolve them
				const existing = await col.find({}).toArray();
				seedMap[collectionName] = new Map(
					existing.map((r) => [Number((r as any).id), r as Record<string, unknown>]),
				);
				continue;
			}
		}

		const resolver = makeSeedResolver();
		const foldedRecords: Record<string, unknown>[] = [];

		for (const row of rows as Record<string, unknown>[]) {
			if (!row || typeof row !== 'object') { foldedRecords.push(row); continue; }
			const withCode: Record<string, unknown> =
				(row.code === undefined || row.code === null || row.code === '') && row.id != null
					? { ...row, code: String(row.id) }
					: { ...row };
			const { data: folded } = await foldFks(model, collectionName, withCode, resolver);
			foldedRecords.push(folded);
		}

		await col.insertMany(foldedRecords);
		console.log(`  [business] ${collectionName} → ${org}_${base} — inserted ${foldedRecords.length} docs`);

		// Index inserted records for downstream FK resolution
		seedMap[collectionName] = new Map(
			foldedRecords.map((r) => [Number(r.id), r]),
		);
	}
}
