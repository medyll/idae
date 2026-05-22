/**
 * seedBusinessData — inserts business data rows into MongoDB.
 * Idempotent: skips any collection that already has documents.
 *
 * Business collections (vehicle, category, reservation…) live in {org}_machine_user.
 * Same connection used by seedUsers.
 */
import type { Connection } from 'mongoose';

/**
 * Seed business data rows into MongoDB.
 * @param data  Record<collectionName, rows[]> — e.g. { vehicle: [...], category: [...] }
 * @param conn  Mongoose connection to the {org}_machine_user database
 */
export async function seedBusinessData(
	data: Record<string, unknown[]>,
	conn: Connection,
): Promise<void> {
	for (const [collectionName, rows] of Object.entries(data)) {
		if (!rows || rows.length === 0) continue;

		const col   = conn.collection(collectionName);
		const count = await col.countDocuments();

		if (count > 0) {
			console.log(`  [business] ${collectionName} — already seeded (${count} docs), skipped`);
			continue;
		}

		await col.insertMany(rows as any[]);
		console.log(`  [business] ${collectionName} — inserted ${rows.length} docs`);
	}
}
