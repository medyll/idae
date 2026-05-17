/**
 * MachineHistory — aggregated projection of recent visits backed by `_history` collection.
 *
 * Maintains _history via upsert: on each visit, increments count + updates lastSeen + refreshes label.
 *
 * API:
 *   machine.history.push(collection, id, label) → upsert _history
 *   machine.history.recent(collection?, limit?) → sorted by lastSeen desc
 *   machine.history.frequent(collection?, limit?) → sorted by count desc
 */
import type { QoolieCollection } from '@medyll/qoolie';

interface HistoryDoc {
	id: string;
	collection: string;
	collection_value: unknown;
	label?: string;
	count: number;
	lastSeen: string;
}

export class MachineHistory {
	private _getCollection: () => QoolieCollection<HistoryDoc>;

	constructor(getCollection: () => QoolieCollection<HistoryDoc>) {
		this._getCollection = getCollection;
	}

	private get _history() {
		return this._getCollection();
	}

	/**
	 * Push a visit — upserts the history entry.
	 * @param collection - collection name
	 * @param value - record identifier
	 * @param label - display snapshot (optional)
	 */
	async push(collection: string, value: unknown, label?: string): Promise<void> {
		const all = this._history.getAll();
		const existing = all.find(
			(d) => d.collection === collection && String(d.collection_value) === String(value)
		);
		const now = new Date().toISOString();

		if (existing) {
			await this._history.update(existing.id, {
				count: existing.count + 1,
				lastSeen: now,
				...(label !== undefined && { label }),
			});
		} else {
			await this._history.create({
				id: crypto.randomUUID(),
				collection,
				collection_value: value,
				label,
				count: 1,
				lastSeen: now,
			});
		}
	}

	/**
	 * Get recent history entries sorted by lastSeen desc.
	 * @param collection - optional filter by collection
	 * @param limit - max entries (default: 50)
	 */
	recent(collection?: string, limit = 50): HistoryDoc[] {
		let all = this._history.getAll();
		if (collection) all = all.filter((d) => d.collection === collection);
		return all.toSorted((a, b) => b.lastSeen.localeCompare(a.lastSeen)).slice(0, limit);
	}

	/**
	 * Get frequent history entries sorted by count desc.
	 * @param collection - optional filter by collection
	 * @param limit - max entries (default: 50)
	 */
	frequent(collection?: string, limit = 50): HistoryDoc[] {
		let all = this._history.getAll();
		if (collection) all = all.filter((d) => d.collection === collection);
		return all.toSorted((a, b) => b.count - a.count).slice(0, limit);
	}
}
