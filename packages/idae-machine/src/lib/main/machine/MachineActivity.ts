/**
 * MachineActivity — insert-only event log backed by `appuser_activity`.
 *
 * Append events tied to (userId, collection, value). Reads are scoped to
 * the current user. No-op when no user is authenticated.
 */
import { machine } from '$lib/main/machine.js';

const COLLECTION = 'appuser_activity';

export type ActivityDoc = {
	id:               string;
	userId:           string;
	code:             string;
	collection:       string;
	collection_value: unknown;
	collection_vars?: Record<string, unknown>;
	timestamp:        string;
};

function userId(): string | null {
	const u = machine.rights.currentUser;
	return u ? String(u.id) : null;
}

function col() {
	try {
		return machine.collection(COLLECTION) as unknown as {
			getAll: () => ActivityDoc[] | Promise<ActivityDoc[]>;
			create: (doc: ActivityDoc) => Promise<unknown>;
		};
	} catch {
		return null;
	}
}

async function loadMine(): Promise<ActivityDoc[]> {
	const uid = userId(); if (!uid) return [];
	const c = col(); if (!c) return [];
	const all = await Promise.resolve(c.getAll());
	return all.filter((d) => d.userId === uid);
}

async function log(
	code: string,
	target: { collection: string; value: unknown; vars?: Record<string, unknown> }
): Promise<void> {
	const uid = userId(); if (!uid) return;
	const c = col(); if (!c) return;
	await c.create({
		id:               crypto.randomUUID(),
		userId:           uid,
		code,
		collection:       target.collection,
		collection_value: target.value,
		collection_vars:  target.vars,
		timestamp:        new Date().toISOString()
	});
}

async function recent(limit = 50): Promise<ActivityDoc[]> {
	const mine = await loadMine();
	return mine.toSorted((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, limit);
}

async function byCollection(collection: string, limit = 50): Promise<ActivityDoc[]> {
	const mine = await loadMine();
	return mine
		.filter((d) => d.collection === collection)
		.toSorted((a, b) => b.timestamp.localeCompare(a.timestamp))
		.slice(0, limit);
}

export const machineActivity = { log, recent, byCollection };
export type MachineActivity = typeof machineActivity;
