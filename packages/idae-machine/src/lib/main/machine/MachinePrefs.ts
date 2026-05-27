/**
 * MachinePrefs — user-scoped key/value preferences backed by `appuser_prefs`.
 *
 * Convention: stored doc.code = `${userId}:${key}`. Scope queries match on a
 * code prefix. No wrapper class — pure functions over `machine.collection('appuser_prefs')`.
 *
 * All ops are no-ops (or return `defaultValue`) when no user is authenticated.
 */
import { machine } from '$lib/main/machine.js';

const COLLECTION = 'appuser_prefs';

type PrefDoc = {
	id:    string;
	code:  string;
	name?: string;
	order?: number;
	value?: unknown;
};

function userId(): string | null {
	const u = machine.rights.currentUser;
	return u ? String(u.id) : null;
}

function buildCode(uid: string, key: string): string {
	return `${uid}:${key}`;
}

function col() {
	try {
		return machine.collection(COLLECTION) as unknown as {
			getAll: () => PrefDoc[] | Promise<PrefDoc[]>;
			where:  (q: Record<string, unknown>) => PrefDoc[] | Promise<PrefDoc[]>;
			create: (doc: PrefDoc) => Promise<unknown>;
			update: (id: string, data: Partial<PrefDoc>) => Promise<unknown>;
			delete: (id: string) => Promise<unknown>;
		};
	} catch {
		return null;
	}
}

async function findByCode(code: string): Promise<PrefDoc | null> {
	const c = col();
	if (!c) return null;
	const docs = await Promise.resolve(c.where({ code }));
	return docs.length > 0 ? docs[0] : null;
}

async function get<T = unknown>(key: string, defaultValue: T | null = null): Promise<T | null> {
	const uid = userId(); if (!uid) return defaultValue;
	const doc = await findByCode(buildCode(uid, key));
	return doc ? ((doc.value ?? defaultValue) as T) : defaultValue;
}

async function set(key: string, value: unknown): Promise<void> {
	const uid = userId(); if (!uid) return;
	const c = col(); if (!c) return;
	const code = buildCode(uid, key);
	const existing = await findByCode(code);
	if (existing) {
		await c.update(existing.id, { value });
	} else {
		await c.create({ id: crypto.randomUUID(), code, name: key, value });
	}
}

async function del(key: string): Promise<void> {
	const uid = userId(); if (!uid) return;
	const c = col(); if (!c) return;
	const existing = await findByCode(buildCode(uid, key));
	if (existing) await c.delete(existing.id);
}

async function scope(prefix: string): Promise<Record<string, unknown>> {
	const uid = userId(); if (!uid) return {};
	const c = col(); if (!c) return {};
	const userPrefix = `${uid}:`;
	const all = await Promise.resolve(c.getAll());
	return Object.fromEntries(
		all
			.filter((d) => d.code.startsWith(userPrefix + prefix))
			.map((d) => [d.code.slice(userPrefix.length), d.value])
	);
}

async function reset(prefix: string): Promise<void> {
	const uid = userId(); if (!uid) return;
	const c = col(); if (!c) return;
	const userPrefix = `${uid}:`;
	const all = await Promise.resolve(c.getAll());
	for (const doc of all) {
		if (doc.code.startsWith(userPrefix + prefix)) await c.delete(doc.id);
	}
}

export const machinePrefs = { get, set, del, scope, reset };
export type MachinePrefs = typeof machinePrefs;
