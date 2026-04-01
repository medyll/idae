import { seed } from './seedData';
import { analyzeDemo } from './analyzeDemo';
import type { IdbqModel } from '@medyll/idae-idbql';

type IdbqlStore = Record<string, { count(): Promise<number>; add(item: unknown): Promise<unknown> } | undefined>;

export async function initDemo(idbql: IdbqlStore, model: IdbqModel) {
	// Seed collections if they are empty
	try {
		// For each collection in seed, add entries if collection exists
		for (const [collection, items] of Object.entries(seed as any)) {
			if (!Array.isArray(items) || items.length === 0) continue;
			const store = idbql[collection];
			if (!store) continue;
			const count = await store.count();
			if (count === 0) {
				for (const item of items) {
					await store.add(item);
				}
			}
		}
	} catch (e) {
		console.error('Demo seeding failed:', e);
	}

	// Run analyzer to update demo-status.json
	const status = analyzeDemo(model);
	console.log('Demo analyzer result:', status);
	return status;
}
