import { describe, it, expect, beforeEach } from 'vitest';
import { MachineHistory } from '../machine/MachineHistory.js';
import type { QoolieCollection } from '@medyll/qoolie';

function mockHistoryCollection() {
	const docs: Array<{
		id: string; collection: string; collection_value: unknown;
		label?: string; count: number; lastSeen: string;
	}> = [];
	const col = {
		getAll: () => [...docs],
		create: async (doc: { id: string; collection: string; collection_value: unknown; label?: string; count: number; lastSeen: string }) => {
			docs.push(doc);
			return doc;
		},
		update: async (id: string, data: { count?: number; lastSeen?: string; label?: string }) => {
			const idx = docs.findIndex((d) => d.id === id);
			if (idx !== -1) Object.assign(docs[idx], data);
		},
	} as unknown as QoolieCollection<any>;
	return { col, docs };
}

describe('MachineHistory', () => {
	let history: MachineHistory;
	let col: ReturnType<typeof mockHistoryCollection>['col'];

	beforeEach(() => {
		const mock = mockHistoryCollection();
		col = mock.col;
		history = new MachineHistory(() => col);
	});

	it('pushes a new entry', async () => {
		await history.push('client', '63361', 'Client ABC');
		const recent = history.recent();
		expect(recent).toHaveLength(1);
		expect(recent[0].collection).toBe('client');
		expect(recent[0].collection_value).toBe('63361');
		expect(recent[0].label).toBe('Client ABC');
		expect(recent[0].count).toBe(1);
	});

	it('upserts on duplicate push (increments count)', async () => {
		await history.push('client', '63361', 'First');
		await history.push('client', '63361', 'Second');
		const entries = history.recent();
		expect(entries).toHaveLength(1);
		expect(entries[0].count).toBe(2);
		expect(entries[0].label).toBe('Second');
	});

	it('recent returns sorted by lastSeen desc', async () => {
		await history.push('client', '1', 'A');
		await new Promise((r) => setTimeout(r, 10));
		await history.push('order', '2', 'B');
		const recent = history.recent();
		expect(recent[0].collection).toBe('order');
		expect(recent[1].collection).toBe('client');
	});

	it('recent filters by collection', async () => {
		await history.push('client', '1', 'A');
		await history.push('order', '2', 'B');
		await history.push('client', '3', 'C');
		const clientRecent = history.recent('client');
		expect(clientRecent.every((e) => e.collection === 'client')).toBe(true);
		expect(clientRecent).toHaveLength(2);
	});

	it('recent respects limit', async () => {
		for (let i = 0; i < 10; i++) {
			await history.push('client', String(i), `Label ${i}`);
		}
		expect(history.recent(undefined, 3)).toHaveLength(3);
	});

	it('frequent returns sorted by count desc', async () => {
		await history.push('client', '1', 'A');
		await history.push('client', '1', 'A');
		await history.push('client', '1', 'A');
		await history.push('client', '2', 'B');
		await history.push('client', '2', 'B');
		const frequent = history.frequent('client');
		expect(frequent[0].collection_value).toBe('1');
		expect(frequent[0].count).toBe(3);
		expect(frequent[1].collection_value).toBe('2');
		expect(frequent[1].count).toBe(2);
	});

	it('frequent filters by collection', async () => {
		await history.push('client', '1', 'A');
		await history.push('client', '1', 'A');
		await history.push('order', '2', 'B');
		await history.push('order', '2', 'B');
		await history.push('order', '2', 'B');
		const clientFreq = history.frequent('client');
		expect(clientFreq.every((e) => e.collection === 'client')).toBe(true);
	});

	it('frequent respects limit', async () => {
		for (let i = 0; i < 10; i++) {
			await history.push('client', String(i), `Label ${i}`);
			await history.push('client', String(i), `Label ${i}`);
		}
		expect(history.frequent(undefined, 3)).toHaveLength(3);
	});
});
