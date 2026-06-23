/**
 * MachineMenuStore tests — unit tests for the reactive menu tree derivation.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readable } from 'svelte/store';
import { createMachineMenuStore } from '../MachineMenuStore.js';
import type { MachineRights as MachineRightsType } from '$lib/main/machine/MachineRights.js';

// This test requires a client environment (jsdom) because it uses Svelte stores
// Run with: pnpm run test:unit -- --run --environment jsdom

describe('createMachineMenuStore', () => {
	const mockRights: Pick<MachineRightsType, 'allowedCollections'> = {
		allowedCollections: vi.fn((_op?: string) => ['users', 'products', 'orders'])
	};

	const mockPrefs = readable({});
	const mockAppscheme = readable(new Map([
		['users', { code: 'users', label: 'Users', icon: 'user', fks: { appscheme_type: { code: 'admin' } } }],
		['products', { code: 'products', label: 'Products', icon: 'box', fks: { appscheme_type: { code: 'catalog' } } }],
		['orders', { code: 'orders', label: 'Orders', icon: 'cart', fks: { appscheme_type: { code: 'sales' } } }]
	]));
	const mockAppschemeType = readable(new Map([
		['admin', { code: 'admin', label: 'Administration' }],
		['catalog', { code: 'catalog', label: 'Catalog' }],
		['sales', { code: 'sales', label: 'Sales' }]
	]));
	const mockIsDev = readable(false);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('creates a derived store that produces a menu tree', () => {
		const store = createMachineMenuStore(
			{
				rights: mockRights,
				prefs: mockPrefs,
				appscheme: mockAppscheme,
				appscheme_type: mockAppschemeType,
				isDev: mockIsDev
			},
			{ zone: 'side' }
		);

		expect(store).toBeDefined();
		
		let tree: any;
		store.subscribe((value) => { tree = value; })();
		
		expect(tree).toBeDefined();
		expect(tree.zone).toBe('side');
		expect(Array.isArray(tree.groups)).toBe(true);
	});

	it('groups items by type and sorts them', () => {
		const store = createMachineMenuStore(
			{
				rights: mockRights,
				prefs: mockPrefs,
				appscheme: mockAppscheme,
				appscheme_type: mockAppschemeType,
				isDev: mockIsDev
			},
			{ zone: 'side' }
		);

		let tree: any;
		store.subscribe((value) => { tree = value; })();

		expect(tree.groups.length).toBe(3);
		expect(tree.groups[0].key).toBe('admin');
		expect(tree.groups[0].items.length).toBe(1);
		expect(tree.groups[0].items[0].collection).toBe('users');
	});

	it('filters collections based on rights', () => {
		const limitedRights: Pick<MachineRightsType, 'allowedCollections'> = {
			allowedCollections: vi.fn((_op?: string) => ['users', 'products'])
		};

		const store = createMachineMenuStore(
			{
				rights: limitedRights,
				prefs: mockPrefs,
				appscheme: mockAppscheme,
				appscheme_type: mockAppschemeType,
				isDev: mockIsDev
			},
			{ zone: 'side' }
		);

		let tree: any;
		store.subscribe((value) => { tree = value; })();

		// Should only have users and products, not orders
		const allItems = tree.groups.flatMap((g: any) => g.items);
		expect(allItems.some((i: any) => i.collection === 'users')).toBe(true);
		expect(allItems.some((i: any) => i.collection === 'products')).toBe(true);
		expect(allItems.some((i: any) => i.collection === 'orders')).toBe(false);
	});
});