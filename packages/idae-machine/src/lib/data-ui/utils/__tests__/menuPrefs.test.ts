import { describe, it, expect } from 'vitest';
import {
	MENU_ZONES,
	menuPrefsScope,
	menuPrefsPrefix,
	isMenuCollectionVisible,
	filterMenuCollections,
	type MenuZone
} from '$lib/data-ui/utils/menuPrefs.js';

describe('menuPrefs — zone mapping', () => {
	it('maps zones to canonical appuser_prefs prefixes', () => {
		expect(MENU_ZONES.side).toBe('app_menu');
		expect(MENU_ZONES.start).toBe('app_menu_start');
		expect(MENU_ZONES.create).toBe('app_menu_create');
		expect(MENU_ZONES.panel).toBe('app_panel');
	});

	it('resolves menuPrefsScope(zone, collection)', () => {
		expect(menuPrefsScope('side', 'vehicle')).toBe('app_menu.vehicle');
		expect(menuPrefsScope('start', 'category')).toBe('app_menu_start.category');
		expect(menuPrefsScope('create', 'rental')).toBe('app_menu_create.rental');
		expect(menuPrefsScope('panel', 'vehicle')).toBe('app_panel.vehicle');
	});

	it('resolves menuPrefsPrefix(zone)', () => {
		expect(menuPrefsPrefix('side')).toBe('app_menu');
		expect(menuPrefsPrefix('start')).toBe('app_menu_start');
	});
});

describe('menuPrefs — isMenuCollectionVisible', () => {
	it('shows all collections when prefs are empty', () => {
		expect(isMenuCollectionVisible('side', 'vehicle', {})).toBe(true);
		expect(isMenuCollectionVisible('side', 'vehicle', undefined as unknown as Record<string, unknown>)).toBe(true);
	});

	it('shows all collections in dev mode even with explicit false prefs', () => {
		const prefs = { 'app_menu.vehicle': false };
		expect(isMenuCollectionVisible('side', 'vehicle', prefs, true)).toBe(true);
	});

	it('shows collection when explicit pref is true', () => {
		const prefs = { 'app_menu.vehicle': true };
		expect(isMenuCollectionVisible('side', 'vehicle', prefs)).toBe(true);
	});

	it('hides collection when explicit pref is false', () => {
		const prefs = { 'app_menu.vehicle': false };
		expect(isMenuCollectionVisible('side', 'vehicle', prefs)).toBe(false);
	});

	it('shows collection when pref is unset (default policy)', () => {
		const prefs = { 'app_menu.category': true };
		expect(isMenuCollectionVisible('side', 'vehicle', prefs)).toBe(true);
	});

	it('coerces non-boolean pref values', () => {
		expect(isMenuCollectionVisible('side', 'vehicle', { 'app_menu.vehicle': 1 })).toBe(true);
		expect(isMenuCollectionVisible('side', 'vehicle', { 'app_menu.vehicle': 0 })).toBe(false);
		expect(isMenuCollectionVisible('side', 'vehicle', { 'app_menu.vehicle': 'yes' })).toBe(true);
		expect(isMenuCollectionVisible('side', 'vehicle', { 'app_menu.vehicle': '' })).toBe(false);
	});
});

describe('menuPrefs — filterMenuCollections', () => {
	it('returns all collections when prefs are empty', () => {
		const cols = ['vehicle', 'category', 'rental'];
		expect(filterMenuCollections('side', cols)).toEqual(cols);
		expect(filterMenuCollections('side', cols, { prefs: {} })).toEqual(cols);
	});

	it('returns all collections in dev mode', () => {
		const cols = ['vehicle', 'category'];
		const prefs = { 'app_menu.vehicle': false };
		expect(filterMenuCollections('side', cols, { prefs, isDev: true })).toEqual(cols);
	});

	it('applies explicit false prefs', () => {
		const cols = ['vehicle', 'category', 'rental'];
		const prefs = {
			'app_menu.vehicle': false,
			'app_menu.category': true
		};
		expect(filterMenuCollections('side', cols, { prefs })).toEqual(['category', 'rental']);
	});

	it('intersects with permittedCollections when provided', () => {
		const cols = ['vehicle', 'category', 'rental'];
		const permitted = ['vehicle', 'rental'];
		expect(filterMenuCollections('side', cols, { permittedCollections: permitted })).toEqual([
			'vehicle',
			'rental'
		]);
	});

	it('applies pref filter after permittedCollections intersection', () => {
		const cols = ['vehicle', 'category', 'rental'];
		const permitted = ['vehicle', 'category'];
		const prefs = { 'app_menu.vehicle': false };
		expect(filterMenuCollections('side', cols, { permittedCollections: permitted, prefs })).toEqual([
			'category'
		]);
	});

	it('preserves different zones independently', () => {
		const cols = ['vehicle'];
		const prefs = { 'app_menu.vehicle': false, 'app_menu_start.vehicle': true };
		expect(filterMenuCollections('side', cols, { prefs })).toEqual([]);
		expect(filterMenuCollections('start', cols, { prefs })).toEqual(['vehicle']);
	});
});
