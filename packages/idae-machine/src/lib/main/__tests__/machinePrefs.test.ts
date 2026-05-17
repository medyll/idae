import { describe, it, expect, beforeEach } from 'vitest';
import { MachinePrefs } from '../machine/MachinePrefs.js';
import type { QoolieCollection } from '@medyll/qoolie';

function mockPrefsCollection() {
	const docs: Array<{ id: string; code: string; name?: string; order?: number; value?: unknown }> = [];
	const col = {
		getAll: () => [...docs],
		where: (query: Record<string, { eq: unknown }>) => {
			const key = Object.keys(query)[0];
			const val = query[key].eq;
			return docs.filter((d) => (d as any)[key] === val);
		},
		create: async (doc: { id: string; code: string; name?: string; value?: unknown }) => {
			docs.push(doc);
			return doc;
		},
		update: async (id: string, data: { value?: unknown }) => {
			const idx = docs.findIndex((d) => d.id === id);
			if (idx !== -1) Object.assign(docs[idx], data);
		},
		delete: async (id: string) => {
			const idx = docs.findIndex((d) => d.id === id);
			if (idx !== -1) docs.splice(idx, 1);
		},
	} as unknown as QoolieCollection<any>;
	return { col, docs };
}

describe('MachinePrefs', () => {
	let prefs: MachinePrefs;
	let col: ReturnType<typeof mockPrefsCollection>['col'];

	beforeEach(() => {
		const mock = mockPrefsCollection();
		col = mock.col;
		prefs = new MachinePrefs(() => col);
	});

	it('returns null for non-existent key', () => {
		expect(prefs.get('user1', 'pane.menu.client')).toBeNull();
	});

	it('sets and gets a value', async () => {
		await prefs.set('user1', 'pane.menu.client', true);
		expect(prefs.get('user1', 'pane.menu.client')).toBe(true);
	});

	it('upserts on duplicate set', async () => {
		await prefs.set('user1', 'theme', 'dark');
		await prefs.set('user1', 'theme', 'light');
		expect(prefs.get('user1', 'theme')).toBe('light');
	});

	it('deletes a key', async () => {
		await prefs.set('user1', 'temp', 'value');
		expect(prefs.get('user1', 'temp')).toBe('value');
		await prefs.del('user1', 'temp');
		expect(prefs.get('user1', 'temp')).toBeNull();
	});

	it('scope returns matching keys', async () => {
		await prefs.set('user1', 'pane.menu.a', 1);
		await prefs.set('user1', 'pane.menu.b', 2);
		await prefs.set('user1', 'other.key', 3);
		const scoped = prefs.scope('user1', 'pane.menu');
		expect(scoped).toEqual({ 'pane.menu.a': 1, 'pane.menu.b': 2 });
	});

	it('scope isolates by user', async () => {
		await prefs.set('user1', 'pane.menu.a', 1);
		await prefs.set('user2', 'pane.menu.a', 99);
		expect(prefs.scope('user1', 'pane.menu')).toEqual({ 'pane.menu.a': 1 });
		expect(prefs.scope('user2', 'pane.menu')).toEqual({ 'pane.menu.a': 99 });
	});

	it('reset wipes matching keys', async () => {
		await prefs.set('user1', 'pane.menu.a', 1);
		await prefs.set('user1', 'pane.menu.b', 2);
		await prefs.set('user1', 'other.key', 3);
		await prefs.reset('user1', 'pane.menu');
		expect(prefs.get('user1', 'pane.menu.a')).toBeNull();
		expect(prefs.get('user1', 'pane.menu.b')).toBeNull();
		expect(prefs.get('user1', 'other.key')).toBe(3);
	});

	it('handles JSON values', async () => {
		const obj = { collapsed: true, order: ['a', 'b'] };
		await prefs.set('user1', 'layout', obj);
		expect(prefs.get('user1', 'layout')).toEqual(obj);
	});
});
