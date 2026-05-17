/**
 * MachineActivity — insert-only event log backed by IDB `_activity` collection.
 *
 * API:
 *   machine.activity.log(code, { collection, value, vars? }) → adds _activity doc
 *   machine.activity.recent(limit?) → latest events across all collections
 *   machine.activity.byCollection(col, limit?) → events for a specific collection
 */
import type { QoolieCollection } from '@medyll/qoolie';

interface ActivityDoc {
	id: string;
	code: string;
	collection: string;
	collection_value: unknown;
	collection_vars?: Record<string, unknown>;
	timestamp: string;
}

export class MachineActivity {
	private _getCollection: () => QoolieCollection<ActivityDoc>;

	constructor(getCollection: () => QoolieCollection<ActivityDoc>) {
		this._getCollection = getCollection;
	}

	private get _activity() {
		return this._getCollection();
	}

	/**
	 * Log an event.
	 * @param code - event code (e.g. 'CREATE', 'VIEW', 'EDIT', 'DELETE')
	 * @param target - { collection, value, vars? }
	 */
	async log(
		code: string,
		target: { collection: string; value: unknown; vars?: Record<string, unknown> }
	): Promise<void> {
		await this._activity.create({
			id: crypto.randomUUID(),
			code,
			collection: target.collection,
			collection_value: target.value,
			collection_vars: target.vars,
			timestamp: new Date().toISOString(),
		});
	}

	/**
	 * Get recent events across all collections.
	 * @param limit - max events to return (default: 50)
	 */
	recent(limit = 50): ActivityDoc[] {
		const all = this._activity.getAll();
		return all
			.toSorted((a, b) => b.timestamp.localeCompare(a.timestamp))
			.slice(0, limit);
	}

	/**
	 * Get events for a specific collection.
	 * @param collection - collection name
	 * @param limit - max events to return (default: 50)
	 */
	byCollection(collection: string, limit = 50): ActivityDoc[] {
		const all = this._activity.getAll();
		return all
			.filter((d) => d.collection === collection)
			.toSorted((a, b) => b.timestamp.localeCompare(a.timestamp))
			.slice(0, limit);
	}
}
