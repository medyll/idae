/**
 * _history collection — aggregated recent visits patterns.
 * No wrapper class. Direct machine.collection('_history') usage.
 *
 * Shape: { id, collection, collection_value, label?, count, lastSeen }
 * Upsert: match on (collection + collection_value), increment count.
 */
import { describe, it, expect, beforeEach } from 'vitest';

type HistoryDoc = {
	id: string; collection: string; collection_value: unknown;
	label?: string; count: number; lastSeen: string;
};

function mockCollection() {
	const docs: HistoryDoc[] = [];
	return {
		getAll: () => [...docs],
		create: async (doc: HistoryDoc) => { docs.push(doc); return doc; },
		update: async (id: string, data: Partial<HistoryDoc>) => {
			const i = docs.findIndex((d) => d.id === id);
			if (i !== -1) Object.assign(docs[i], data);
		},
	};
}

// ── inline patterns ──────────────────────────────────────────────────────────

async function historyPush(
	col: ReturnType<typeof mockCollection>,
	collection: string, value: unknown, label?: string
) {
	const all = col.getAll();
	const existing = all.find((d) => d.collection === collection && String(d.collection_value) === String(value));
	const now = new Date().toISOString();
	if (existing) {
		await col.update(existing.id, { count: existing.count + 1, lastSeen: now, ...(label !== undefined && { label }) });
	} else {
		await col.create({ id: crypto.randomUUID(), collection, collection_value: value, label, count: 1, lastSeen: now });
	}
}

function historyRecent(col: ReturnType<typeof mockCollection>, collection?: string, limit = 50) {
	let all = col.getAll();
	if (collection) all = all.filter((d) => d.collection === collection);
	return all.toSorted((a, b) => b.lastSeen.localeCompare(a.lastSeen)).slice(0, limit);
}

function historyFrequent(col: ReturnType<typeof mockCollection>, collection?: string, limit = 50) {
	let all = col.getAll();
	if (collection) all = all.filter((d) => d.collection === collection);
	return all.toSorted((a, b) => b.count - a.count).slice(0, limit);
}

// ── tests ────────────────────────────────────────────────────────────────────

describe('_history collection patterns', () => {
	let col: ReturnType<typeof mockCollection>;
	beforeEach(() => { col = mockCollection(); });

	it('pushes a new entry', async () => {
		await historyPush(col, 'client', '63361', 'Client ABC');
		const recent = historyRecent(col);
		expect(recent).toHaveLength(1);
		expect(recent[0].collection).toBe('client');
		expect(recent[0].collection_value).toBe('63361');
		expect(recent[0].label).toBe('Client ABC');
		expect(recent[0].count).toBe(1);
	});

	it('upserts on duplicate push — increments count', async () => {
		await historyPush(col, 'client', '63361', 'First');
		await historyPush(col, 'client', '63361', 'Second');
		const entries = historyRecent(col);
		expect(entries).toHaveLength(1);
		expect(entries[0].count).toBe(2);
		expect(entries[0].label).toBe('Second');
	});

	it('recent returns sorted by lastSeen desc', async () => {
		await historyPush(col, 'client', '1', 'A');
		await new Promise((r) => setTimeout(r, 10));
		await historyPush(col, 'order', '2', 'B');
		const recent = historyRecent(col);
		expect(recent[0].collection).toBe('order');
		expect(recent[1].collection).toBe('client');
	});

	it('recent filters by collection', async () => {
		await historyPush(col, 'client', '1', 'A');
		await historyPush(col, 'order', '2', 'B');
		await historyPush(col, 'client', '3', 'C');
		const clientRecent = historyRecent(col, 'client');
		expect(clientRecent.every((e) => e.collection === 'client')).toBe(true);
		expect(clientRecent).toHaveLength(2);
	});

	it('recent respects limit', async () => {
		for (let i = 0; i < 10; i++) await historyPush(col, 'client', String(i), `Label ${i}`);
		expect(historyRecent(col, undefined, 3)).toHaveLength(3);
	});

	it('frequent returns sorted by count desc', async () => {
		await historyPush(col, 'client', '1', 'A');
		await historyPush(col, 'client', '1', 'A');
		await historyPush(col, 'client', '1', 'A');
		await historyPush(col, 'client', '2', 'B');
		await historyPush(col, 'client', '2', 'B');
		const frequent = historyFrequent(col, 'client');
		expect(frequent[0].collection_value).toBe('1');
		expect(frequent[0].count).toBe(3);
		expect(frequent[1].count).toBe(2);
	});

	it('frequent filters by collection', async () => {
		await historyPush(col, 'client', '1', 'A');
		await historyPush(col, 'order', '2', 'B');
		const clientFreq = historyFrequent(col, 'client');
		expect(clientFreq.every((e) => e.collection === 'client')).toBe(true);
	});

	it('frequent respects limit', async () => {
		for (let i = 0; i < 10; i++) {
			await historyPush(col, 'client', String(i), `L${i}`);
			await historyPush(col, 'client', String(i), `L${i}`);
		}
		expect(historyFrequent(col, undefined, 3)).toHaveLength(3);
	});
});
