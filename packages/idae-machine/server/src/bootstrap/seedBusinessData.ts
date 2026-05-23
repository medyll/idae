/**
 * seedBusinessData — inserts business data rows into MongoDB.
 * Idempotent: skips any collection that already has documents.
 *
 * Routes each collection to the DB derived from its declared `base` field
 * in the MachineModel (e.g. base='machine_base' → {org}_machine_base).
 * Falls back to 'machine_user' if model entry has no base.
 */
import type { Connection } from 'mongoose';
import { mongooseConnectionManager } from '@medyll/idae-api';
import type { MachineModel } from '../../../src/lib/types/machine-model.js';

const DEFAULT_BASE = 'machine_user';

export interface SeedBusinessOpts {
	org:       string;
	mongoUri:  string;
	model:     MachineModel;
	data:      Record<string, unknown[]>;
}

/**
 * Seed business data rows into MongoDB, routing each collection to its
 * model-declared base database.
 */
export async function seedBusinessData(opts: SeedBusinessOpts): Promise<void> {
	const { org, mongoUri, model, data } = opts;
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

	for (const [collectionName, rows] of Object.entries(data)) {
		if (!rows || rows.length === 0) continue;

		const base = model[collectionName]?.base ?? DEFAULT_BASE;
		const conn = await getConn(base);
		const col  = conn.collection(collectionName);
		const count = await col.countDocuments();

		if (count > 0) {
			console.log(`  [business] ${collectionName} → ${org}_${base} — already seeded (${count} docs), skipped`);
			continue;
		}

		await col.insertMany(rows as any[]);
		console.log(`  [business] ${collectionName} → ${org}_${base} — inserted ${rows.length} docs`);
	}
}
