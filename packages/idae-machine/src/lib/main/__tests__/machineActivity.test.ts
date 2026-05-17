import { describe, it, expect, beforeEach } from 'vitest';
import { MachineActivity } from '../machine/MachineActivity.js';
import type { QoolieCollection } from '@medyll/qoolie';

function mockActivityCollection() {
	const docs: Array<{
		id: string; code: string; collection: string;
		collection_value: unknown; collection_vars?: Record<string, unknown>;
		timestamp: string;
	}> = [];
	const col = {
		getAll: () => [...docs],
		create: async (doc: { id: string; code: string; collection: string; collection_value: unknown; collection_vars?: Record<string, unknown>; timestamp: string }) => {
			docs.push(doc);
			return doc;
		},
	} as unknown as QoolieCollection<any>;
	return { col, docs };
}

describe('MachineActivity', () => {
	let activity: MachineActivity;
	let col: ReturnType<typeof mockActivityCollection>['col'];

	beforeEach(() => {
		const mock = mockActivityCollection();
		col = mock.col;
		activity = new MachineActivity(() => col);
	});

	it('logs an event', async () => {
		await activity.log('CREATE', { collection: 'client', value: '63361' });
		const recent = activity.recent();
		expect(recent).toHaveLength(1);
		expect(recent[0].code).toBe('CREATE');
		expect(recent[0].collection).toBe('client');
		expect(recent[0].collection_value).toBe('63361');
	});

	it('logs with vars', async () => {
		await activity.log('EDIT', { collection: 'user', value: 42, vars: { field: 'name' } });
		const events = activity.recent();
		expect(events[0].collection_vars).toEqual({ field: 'name' });
	});

	it('recent returns sorted by timestamp desc', async () => {
		await activity.log('A', { collection: 'x', value: 1 });
		await new Promise((r) => setTimeout(r, 10));
		await activity.log('B', { collection: 'x', value: 2 });
		const recent = activity.recent();
		expect(recent[0].code).toBe('B');
		expect(recent[1].code).toBe('A');
	});

	it('recent respects limit', async () => {
		for (let i = 0; i < 10; i++) {
			await activity.log('EVT', { collection: 'x', value: i });
		}
		expect(activity.recent(3)).toHaveLength(3);
	});

	it('byCollection filters correctly', async () => {
		await activity.log('A', { collection: 'client', value: 1 });
		await activity.log('B', { collection: 'order', value: 2 });
		await activity.log('C', { collection: 'client', value: 3 });
		const clientEvents = activity.byCollection('client');
		expect(clientEvents).toHaveLength(2);
		expect(clientEvents.every((e) => e.collection === 'client')).toBe(true);
	});

	it('byCollection respects limit', async () => {
		for (let i = 0; i < 5; i++) {
			await activity.log('EVT', { collection: 'client', value: i });
		}
		expect(activity.byCollection('client', 2)).toHaveLength(2);
	});

	it('insert-only: no update or delete exposed', () => {
		expect(activity).not.toHaveProperty('update');
		expect(activity).not.toHaveProperty('delete');
	});
});
