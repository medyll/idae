/**
 * appuser_prefs collection — usage patterns directly via machine.collection('appuser_prefs').
 * No wrapper class. Tests document the expected data shape and query conventions.
 *
 * Key convention: code = `${userId}:${key}` (e.g. 'user1:pane.menu.client')
 */
import { describe, it, expect, beforeEach } from 'vitest';

type PrefDoc = { id: string; code: string; name?: string; value?: unknown };

function mockCollection() {
	const docs: PrefDoc[] = [];
	return {
		getAll: () => [...docs],
		where: (q: Record<string, { eq: unknown }>) => {
			const [field, { eq }] = Object.entries(q)[0];
			return docs.filter((d) => (d as any)[field] === eq);
		},
		create: async (doc: PrefDoc) => { docs.push(doc); return doc; },
		update: async (id: string, data: Partial<PrefDoc>) => {
			const i = docs.findIndex((d) => d.id === id);
			if (i !== -1) Object.assign(docs[i], data);
		},
		delete: async (id: string) => {
			const i = docs.findIndex((d) => d.id === id);
			if (i !== -1) docs.splice(i, 1);
		},
	};
}

// ── helpers (inline patterns, not classes) ──────────────────────────────────

function buildCode(userId: string, key: string) { return `${userId}:${key}`; }

function prefGet(col: ReturnType<typeof mockCollection>, userId: string, key: string): unknown {
	const docs = col.where({ code: { eq: buildCode(userId, key) } });
	return docs.length > 0 ? docs[0].value ?? null : null;
}

async function prefSet(col: ReturnType<typeof mockCollection>, userId: string, key: string, value: unknown) {
	const code = buildCode(userId, key);
	const existing = col.where({ code: { eq: code } });
	if (existing.length > 0) {
		await col.update(existing[0].id, { value });
	} else {
		await col.create({ id: crypto.randomUUID(), code, name: key, value });
	}
}

async function prefDel(col: ReturnType<typeof mockCollection>, userId: string, key: string) {
	const existing = col.where({ code: { eq: buildCode(userId, key) } });
	if (existing.length > 0) await col.delete(existing[0].id);
}

function prefScope(col: ReturnType<typeof mockCollection>, userId: string, prefix: string): Record<string, unknown> {
	const userPrefix = `${userId}:`;
	return Object.fromEntries(
		col.getAll()
			.filter((d) => d.code.startsWith(userPrefix + prefix))
			.map((d) => [d.code.slice(userPrefix.length), d.value])
	);
}

async function prefReset(col: ReturnType<typeof mockCollection>, userId: string, scope: string) {
	const userPrefix = `${userId}:`;
	for (const doc of col.getAll()) {
		if (doc.code.startsWith(userPrefix + scope)) await col.delete(doc.id);
	}
}

// ── tests ───────────────────────────────────────────────────────────────────

describe('appuser_prefs collection patterns', () => {
	let col: ReturnType<typeof mockCollection>;
	beforeEach(() => { col = mockCollection(); });

	it('returns null for non-existent key', () => {
		expect(prefGet(col, 'user1', 'pane.menu.client')).toBeNull();
	});

	it('sets and gets a value', async () => {
		await prefSet(col, 'user1', 'pane.menu.client', true);
		expect(prefGet(col, 'user1', 'pane.menu.client')).toBe(true);
	});

	it('upserts on duplicate set', async () => {
		await prefSet(col, 'user1', 'theme', 'dark');
		await prefSet(col, 'user1', 'theme', 'light');
		expect(prefGet(col, 'user1', 'theme')).toBe('light');
	});

	it('deletes a key', async () => {
		await prefSet(col, 'user1', 'temp', 'value');
		await prefDel(col, 'user1', 'temp');
		expect(prefGet(col, 'user1', 'temp')).toBeNull();
	});

	it('scope returns matching keys', async () => {
		await prefSet(col, 'user1', 'pane.menu.a', 1);
		await prefSet(col, 'user1', 'pane.menu.b', 2);
		await prefSet(col, 'user1', 'other.key', 3);
		expect(prefScope(col, 'user1', 'pane.menu')).toEqual({ 'pane.menu.a': 1, 'pane.menu.b': 2 });
	});

	it('scope isolates by user', async () => {
		await prefSet(col, 'user1', 'pane.menu.a', 1);
		await prefSet(col, 'user2', 'pane.menu.a', 99);
		expect(prefScope(col, 'user1', 'pane.menu')).toEqual({ 'pane.menu.a': 1 });
		expect(prefScope(col, 'user2', 'pane.menu')).toEqual({ 'pane.menu.a': 99 });
	});

	it('reset wipes matching keys only', async () => {
		await prefSet(col, 'user1', 'pane.menu.a', 1);
		await prefSet(col, 'user1', 'pane.menu.b', 2);
		await prefSet(col, 'user1', 'other.key', 3);
		await prefReset(col, 'user1', 'pane.menu');
		expect(prefGet(col, 'user1', 'pane.menu.a')).toBeNull();
		expect(prefGet(col, 'user1', 'pane.menu.b')).toBeNull();
		expect(prefGet(col, 'user1', 'other.key')).toBe(3);
	});

	it('stores JSON values', async () => {
		const obj = { collapsed: true, order: ['a', 'b'] };
		await prefSet(col, 'user1', 'layout', obj);
		expect(prefGet(col, 'user1', 'layout')).toEqual(obj);
	});

	it('code format: userId:key', async () => {
		await prefSet(col, 'user1', 'pane.menu.x', true);
		const raw = col.getAll();
		expect(raw[0].code).toBe('user1:pane.menu.x');
	});
});
