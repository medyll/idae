/**
 * MachinePrefs — key-value preference service backed by IDB `_prefs` collection.
 *
 * API:
 *   machine.prefs.get(userId, key)        → value or null
 *   machine.prefs.set(userId, key, value) → upsert
 *   machine.prefs.del(userId, key)        → delete
 *   machine.prefs.scope(userId, prefix)   → Record of prefs matching prefix
 *   machine.prefs.reset(userId, scope)    → wipe + re-init from permissions
 */
import type { QoolieCollection } from '@medyll/qoolie';

export class MachinePrefs {
	private _getCollection: () => QoolieCollection<any>;

	constructor(getCollection: () => QoolieCollection<any>) {
		this._getCollection = getCollection;
	}

	private get _prefs(): QoolieCollection<any> {
		return this._getCollection();
	}

	/**
	 * Get a preference value for a user.
	 * @param userId - user identifier (maps to FK appuser)
	 * @param key - preference key (e.g. 'pane.menu.client')
	 * @returns the stored value or null if not found
	 */
	get(userId: string, key: string): unknown | null {
		const code = this._buildCode(userId, key);
		const docs = this._prefs.where({ code: { eq: code } });
		if (docs.length === 0) return null;
		return docs[0].value ?? null;
	}

	/**
	 * Set a preference value (upsert).
	 * @param userId - user identifier
	 * @param key - preference key
	 * @param value - JSON-encodable value
	 */
	async set(userId: string, key: string, value: unknown): Promise<void> {
		const code = this._buildCode(userId, key);
		const existing = this._prefs.where({ code: { eq: code } });
		if (existing.length > 0) {
			await this._prefs.update(existing[0].id, { value });
		} else {
			await this._prefs.create({
				id: crypto.randomUUID(),
				code,
				name: key,
				value,
			});
		}
	}

	/**
	 * Delete a preference.
	 * @param userId - user identifier
	 * @param key - preference key
	 */
	async del(userId: string, key: string): Promise<void> {
		const code = this._buildCode(userId, key);
		const existing = this._prefs.where({ code: { eq: code } });
		if (existing.length > 0) {
			await this._prefs.delete(existing[0].id);
		}
	}

	/**
	 * Get all preferences matching a prefix for a user.
	 * @param userId - user identifier
	 * @param prefix - key prefix (e.g. 'pane.menu')
	 * @returns Record of key → value for matching prefs
	 */
	scope(userId: string, prefix: string): Record<string, unknown> {
		const userPrefix = `${userId}:`;
		const allPrefs = this._prefs.getAll();
		const result: Record<string, unknown> = {};
		for (const doc of allPrefs) {
			if (doc.code.startsWith(userPrefix + prefix)) {
				const key = doc.code.slice(userPrefix.length);
				result[key] = doc.value;
			}
		}
		return result;
	}

	/**
	 * Reset preferences in a scope — wipes all matching keys.
	 * @param userId - user identifier
	 * @param scope - prefix to wipe (e.g. 'pane.menu')
	 */
	async reset(userId: string, scope: string): Promise<void> {
		const userPrefix = `${userId}:`;
		const allPrefs = this._prefs.getAll();
		for (const doc of allPrefs) {
			if (doc.code.startsWith(userPrefix + scope)) {
				await this._prefs.delete(doc.id);
			}
		}
	}

	private _buildCode(userId: string, key: string): string {
		return `${userId}:${key}`;
	}
}
