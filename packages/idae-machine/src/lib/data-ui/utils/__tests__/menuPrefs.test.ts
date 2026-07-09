import { describe, it, expect } from 'vitest';
import {
	MENU_ZONES,
	menuPrefsScope,
	menuPrefsPrefix,
	isMenuCollectionVisible,
	filterMenuCollections,
	readMenuPrefsFromRecords,
	type MenuZone
} from '$lib/data-ui/utils/menuPrefs.js';

describe('readMenuPrefsFromRecords', () => {
	it('strips the {userId}: prefix and keeps only this user\'s rows', () => {
		const records = [
			{ code: '7:app_menu.vehicle', value: false },
			{ code: '7:app_menu.category', value: true },
			{ code: '9:app_menu.vehicle', value: true } // different user — must be excluded
		];

		expect(readMenuPrefsFromRecords(records, 7)).toEqual({
			'app_menu.vehicle': false,
			'app_menu.category': true
		});
	});

	it('returns an empty object when no record matches the user', () => {
		expect(readMenuPrefsFromRecords([{ code: '9:app_menu.vehicle', value: true }], 7)).toEqual({});
	});

	it('ignores malformed records (missing/non-string code)', () => {
		expect(readMenuPrefsFromRecords([{ value: true }, { code: 42, value: true }], 7)).toEqual({});
	});
});

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
	it('hides all collections when prefs are empty (new policy: unset = hidden)', () => {
		expect(isMenuCollectionVisible('side', 'vehicle', {})).toBe(false);
		expect(isMenuCollectionVisible('side', 'vehicle', undefined as unknown as Record<string, unknown>)).toBe(false);
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

	it('hides collection when pref is unset (new policy: explicit true required)', () => {
		const prefs = { 'app_menu.category': true };
		expect(isMenuCollectionVisible('side', 'vehicle', prefs)).toBe(false);
	});

	it('falls back to baseline when no user override exists (override ?? baseline ?? false)', () => {
		const baseline = { 'app_menu.vehicle': true };
		expect(isMenuCollectionVisible('side', 'vehicle', {}, false, baseline)).toBe(true);
		expect(isMenuCollectionVisible('side', 'category', {}, false, baseline)).toBe(false);
	});

	it('user override wins over baseline — explicit false hides a baseline-visible collection', () => {
		const prefs = { 'app_menu.vehicle': false };
		const baseline = { 'app_menu.vehicle': true };
		expect(isMenuCollectionVisible('side', 'vehicle', prefs, false, baseline)).toBe(false);
	});

	it('user override wins over baseline — explicit true shows a baseline-hidden collection', () => {
		const prefs = { 'app_menu.vehicle': true };
		const baseline = { 'app_menu.vehicle': false };
		expect(isMenuCollectionVisible('side', 'vehicle', prefs, false, baseline)).toBe(true);
	});

	it('coerces non-boolean pref values', () => {
		expect(isMenuCollectionVisible('side', 'vehicle', { 'app_menu.vehicle': 1 })).toBe(true);
		expect(isMenuCollectionVisible('side', 'vehicle', { 'app_menu.vehicle': 0 })).toBe(false);
		expect(isMenuCollectionVisible('side', 'vehicle', { 'app_menu.vehicle': 'yes' })).toBe(true);
		expect(isMenuCollectionVisible('side', 'vehicle', { 'app_menu.vehicle': '' })).toBe(false);
	});
});

describe('menuPrefs — filterMenuCollections', () => {
	it('returns no collections when prefs are empty (new policy: unset = hidden)', () => {
		const cols = ['vehicle', 'category', 'rental'];
		expect(filterMenuCollections('side', cols)).toEqual([]);
		expect(filterMenuCollections('side', cols, { prefs: {} })).toEqual([]);
	});

	it('returns all collections in dev mode', () => {
		const cols = ['vehicle', 'category'];
		const prefs = { 'app_menu.vehicle': false };
		expect(filterMenuCollections('side', cols, { prefs, isDev: true })).toEqual(cols);
	});

	it('applies explicit false prefs (unset others also hidden)', () => {
		const cols = ['vehicle', 'category', 'rental'];
		const prefs = {
			'app_menu.vehicle': false,
			'app_menu.category': true
		};
		expect(filterMenuCollections('side', cols, { prefs })).toEqual(['category']);
	});

	it('includes baseline-visible collections without a user override', () => {
		const cols = ['vehicle', 'category', 'rental'];
		const baseline = { 'app_menu.vehicle': true, 'app_menu.rental': true };
		expect(filterMenuCollections('side', cols, { baseline })).toEqual(['vehicle', 'rental']);
	});

	it('user override false suppresses a baseline-visible collection', () => {
		const cols = ['vehicle', 'category'];
		const prefs = { 'app_menu.vehicle': false };
		const baseline = { 'app_menu.vehicle': true, 'app_menu.category': true };
		expect(filterMenuCollections('side', cols, { prefs, baseline })).toEqual(['category']);
	});

	it('intersects with permittedCollections when provided', () => {
		const cols = ['vehicle', 'category', 'rental'];
		const permitted = ['vehicle', 'rental'];
		const prefs = { 'app_menu.vehicle': true, 'app_menu.rental': true };
		expect(filterMenuCollections('side', cols, { permittedCollections: permitted, prefs })).toEqual([
			'vehicle',
			'rental'
		]);
	});

	it('applies pref filter after permittedCollections intersection', () => {
		const cols = ['vehicle', 'category', 'rental'];
		const permitted = ['vehicle', 'category'];
		const prefs = { 'app_menu.vehicle': false, 'app_menu.category': true };
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
