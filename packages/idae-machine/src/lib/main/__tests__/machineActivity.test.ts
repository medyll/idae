/**
 * appuser_activity collection — insert-only event log patterns.
 * No wrapper class. Direct machine.collection('appuser_activity') usage.
 *
 * Shape: { id, code, collection, collection_value, collection_vars?, timestamp }
 */
import { describe, it, expect, beforeEach } from 'vitest';

type ActivityDoc = {
	id: string; code: string; collection: string;
	collection_value: unknown; collection_vars?: Record<string, unknown>;
	timestamp: string;
};

function mockCollection() {
	const docs: ActivityDoc[] = [];
	return {
		getAll: () => [...docs],
		create: async (doc: ActivityDoc) => { docs.push(doc); return doc; },
	};
}

// ── inline patterns ──────────────────────────────────────────────────────────

async function activityLog(
	col: ReturnType<typeof mockCollection>,
	code: string,
	target: { collection: string; value: unknown; vars?: Record<string, unknown> }
) {
	await col.create({
		id:               crypto.randomUUID(),
		code,
		collection:       target.collection,
		collection_value: target.value,
		collection_vars:  target.vars,
		timestamp:        new Date().toISOString(),
	});
}

function activityRecent(col: ReturnType<typeof mockCollection>, limit = 50) {
	return col.getAll()
		.toSorted((a, b) => b.timestamp.localeCompare(a.timestamp))
		.slice(0, limit);
}

function activityByCollection(col: ReturnType<typeof mockCollection>, collection: string, limit = 50) {
	return col.getAll()
		.filter((d) => d.collection === collection)
		.toSorted((a, b) => b.timestamp.localeCompare(a.timestamp))
		.slice(0, limit);
}

// ── tests ────────────────────────────────────────────────────────────────────

describe('appuser_activity collection patterns', () => {
	let col: ReturnType<typeof mockCollection>;
	beforeEach(() => { col = mockCollection(); });

	it('logs an event with expected shape', async () => {
		await activityLog(col, 'CREATE', { collection: 'client', value: '63361' });
		const recent = activityRecent(col);
		expect(recent).toHaveLength(1);
		expect(recent[0].code).toBe('CREATE');
		expect(recent[0].collection).toBe('client');
		expect(recent[0].collection_value).toBe('63361');
		expect(recent[0].timestamp).toBeDefined();
	});

	it('logs with optional vars', async () => {
		await activityLog(col, 'EDIT', { collection: 'user', value: 42, vars: { field: 'name' } });
		expect(activityRecent(col)[0].collection_vars).toEqual({ field: 'name' });
	});

	it('recent returns sorted by timestamp desc', async () => {
		await activityLog(col, 'A', { collection: 'x', value: 1 });
		await new Promise((r) => setTimeout(r, 10));
		await activityLog(col, 'B', { collection: 'x', value: 2 });
		const recent = activityRecent(col);
		expect(recent[0].code).toBe('B');
		expect(recent[1].code).toBe('A');
	});

	it('recent respects limit', async () => {
		for (let i = 0; i < 10; i++) await activityLog(col, 'EVT', { collection: 'x', value: i });
		expect(activityRecent(col, 3)).toHaveLength(3);
	});

	it('byCollection filters correctly', async () => {
		await activityLog(col, 'A', { collection: 'client', value: 1 });
		await activityLog(col, 'B', { collection: 'order', value: 2 });
		await activityLog(col, 'C', { collection: 'client', value: 3 });
		const events = activityByCollection(col, 'client');
		expect(events).toHaveLength(2);
		expect(events.every((e) => e.collection === 'client')).toBe(true);
	});

	it('byCollection respects limit', async () => {
		for (let i = 0; i < 5; i++) await activityLog(col, 'EVT', { collection: 'client', value: i });
		expect(activityByCollection(col, 'client', 2)).toHaveLength(2);
	});

	it('insert-only: collection has no update or delete', () => {
		expect((col as any).update).toBeUndefined();
		expect((col as any).delete).toBeUndefined();
	});
});
