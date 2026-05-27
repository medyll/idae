/**
 * MachineHistory — aggregated recent visits backed by `appuser_history`.
 *
 * Upsert key: (userId, collection, collection_value). Each push bumps `count`
 * and refreshes `lastSeen`. No-op when no user is authenticated.
 */
import { machine } from '$lib/main/machine.js';

const COLLECTION = 'appuser_history';

export type HistoryDoc = {
	id:               string;
	userId:           string;
	collection:       string;
	collection_value: unknown;
	label?:           string;
	count:            number;
	lastSeen:         string;
};

function userId(): string | null {
	const u = machine.rights.currentUser;
	return u ? String(u.id) : null;
}

function col() {
	try {
		return machine.collection(COLLECTION) as unknown as {
			getAll: () => HistoryDoc[] | Promise<HistoryDoc[]>;
			create: (doc: HistoryDoc) => Promise<unknown>;
			update: (id: string, data: Partial<HistoryDoc>) => Promise<unknown>;
		};
	} catch {
		return null;
	}
}

async function loadMine(): Promise<HistoryDoc[]> {
	const uid = userId(); if (!uid) return [];
	const c = col(); if (!c) return [];
	const all = await Promise.resolve(c.getAll());
	return all.filter((d) => d.userId === uid);
}

async function push(collection: string, value: unknown, label?: string): Promise<void> {
	const uid = userId(); if (!uid) return;
	const c = col(); if (!c) return;
	const mine = await loadMine();
	const existing = mine.find(
		(d) => d.collection === collection && String(d.collection_value) === String(value)
	);
	const now = new Date().toISOString();
	if (existing) {
		await c.update(existing.id, {
			count:    existing.count + 1,
			lastSeen: now,
			...(label !== undefined && { label })
		});
	} else {
		await c.create({
			id:               crypto.randomUUID(),
			userId:           uid,
			collection,
			collection_value: value,
			label,
			count:            1,
			lastSeen:         now
		});
	}
}

async function recent(collection?: string, limit = 50): Promise<HistoryDoc[]> {
	const mine = await loadMine();
	const filtered = collection ? mine.filter((d) => d.collection === collection) : mine;
	return filtered.toSorted((a, b) => b.lastSeen.localeCompare(a.lastSeen)).slice(0, limit);
}

async function frequent(collection?: string, limit = 50): Promise<HistoryDoc[]> {
	const mine = await loadMine();
	const filtered = collection ? mine.filter((d) => d.collection === collection) : mine;
	return filtered.toSorted((a, b) => b.count - a.count).slice(0, limit);
}

export const machineHistory = { push, recent, frequent };
export type MachineHistory = typeof machineHistory;
