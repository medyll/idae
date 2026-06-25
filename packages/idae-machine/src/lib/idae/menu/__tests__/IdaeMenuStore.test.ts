/**
 * IdaeMenuStore tests — unit tests for the pure menu tree builder.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildMenuTree } from '../IdaeMenuStore.js';

describe('buildMenuTree', () => {
	const appscheme = new Map([
		['users', { code: 'users', label: 'Users', icon: 'user', fks: { appscheme_base: { code: 'admin' } } }],
		['products', { code: 'products', label: 'Products', icon: 'box', fks: { appscheme_base: { code: 'catalog' } } }],
		['orders', { code: 'orders', label: 'Orders', icon: 'cart', fks: { appscheme_base: { code: 'sales' } } }]
	]);
	const appschemeBase = new Map([
		['admin', { code: 'admin', label: 'Administration' }],
		['catalog', { code: 'catalog', label: 'Catalog' }],
		['sales', { code: 'sales', label: 'Sales' }]
	]);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('produces a menu tree for a zone', () => {
		const tree = buildMenuTree(
			{
				allowedCollections: ['users', 'products', 'orders'],
				prefs: { 'app_menu.users': true, 'app_menu.products': true, 'app_menu.orders': true },
				appscheme,
				appscheme_base: appschemeBase,
				isDev: false
			},
			'side'
		);

		expect(tree.zone).toBe('side');
		expect(Array.isArray(tree.groups)).toBe(true);
	});

	it('groups items by base and sorts them', () => {
		const tree = buildMenuTree(
			{
				allowedCollections: ['users', 'products', 'orders'],
				prefs: { 'app_menu.users': true, 'app_menu.products': true, 'app_menu.orders': true },
				appscheme,
				appscheme_base: appschemeBase,
				isDev: false
			},
			'side'
		);

		expect(tree.groups.length).toBe(3);
		expect(tree.groups[0].key).toBe('admin');
		expect(tree.groups[0].items.length).toBe(1);
		expect(tree.groups[0].items[0].collection).toBe('users');
	});

	it('filters collections based on rights (allowedCollections)', () => {
		const tree = buildMenuTree(
			{
				allowedCollections: ['users', 'products'],
				prefs: { 'app_menu.users': true, 'app_menu.products': true },
				appscheme,
				appscheme_base: appschemeBase,
				isDev: false
			},
			'side'
		);

		const allItems = tree.groups.flatMap((g) => g.items);
		expect(allItems.some((i) => i.collection === 'users')).toBe(true);
		expect(allItems.some((i) => i.collection === 'products')).toBe(true);
		expect(allItems.some((i) => i.collection === 'orders')).toBe(false);
	});

	it('filters collections based on zone prefs', () => {
		const tree = buildMenuTree(
			{
				allowedCollections: ['users', 'products', 'orders'],
				prefs: { 'app_menu.users': false, 'app_menu.products': true, 'app_menu.orders': true },
				appscheme,
				appscheme_base: appschemeBase,
				isDev: false
			},
			'side'
		);

		const allItems = tree.groups.flatMap((g) => g.items);
		expect(allItems.some((i) => i.collection === 'users')).toBe(false);
		expect(allItems.some((i) => i.collection === 'products')).toBe(true);
	});

	it('dev mode bypasses pref filtering entirely', () => {
		const tree = buildMenuTree(
			{
				allowedCollections: ['users', 'products'],
				prefs: { 'app_menu.users': false },
				appscheme,
				appscheme_base: appschemeBase,
				isDev: true
			},
			'side'
		);

		const allItems = tree.groups.flatMap((g) => g.items);
		expect(allItems.some((i) => i.collection === 'users')).toBe(true);
	});

	it('accepts array inputs for appscheme/appscheme_base (not just Map)', () => {
		const tree = buildMenuTree(
			{
				allowedCollections: ['users'],
				prefs: { 'app_menu.users': true },
				appscheme: Array.from(appscheme.values()),
				appscheme_base: Array.from(appschemeBase.values()),
				isDev: false
			},
			'side'
		);

		expect(tree.groups[0].items[0].collection).toBe('users');
	});

	it('empty prefs hides all collections (new policy: unset = hidden)', () => {
		const tree = buildMenuTree(
			{
				allowedCollections: ['users', 'products', 'orders'],
				prefs: {},
				appscheme,
				appscheme_base: appschemeBase,
				isDev: false
			},
			'side'
		);

		const allItems = tree.groups.flatMap((g) => g.items);
		expect(allItems.length).toBe(0);
	});
});
