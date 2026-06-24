/**
 * IdaeMenuManager tests — unit tests for the menu manager facade.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IdaeMenuManager } from '../IdaeMenuManager.js';
import type { MachineFrameManager } from '$lib/main/frame/MachineFrameManager.js';
import type { MachineRights as MachineRightsType } from '$lib/main/machine/MachineRights.js';

describe('IdaeMenuManager', () => {
	const mockFramer: Partial<MachineFrameManager> = {
		loadFrame: vi.fn(),
		loadInDialog: vi.fn()
	};

	const mockRights: Partial<MachineRightsType> = {
		allowedCollections: vi.fn((_op?: string) => ['users', 'products'])
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('creates a menu manager instance', () => {
		const manager = new IdaeMenuManager(
			mockFramer as MachineFrameManager,
			mockRights as MachineRightsType
		);

		expect(manager).toBeDefined();
		expect(manager.framer).toBe(mockFramer);
		expect(manager.rights).toBe(mockRights);
	});

	it('has default launch verbs', () => {
		const manager = new IdaeMenuManager(
			mockFramer as MachineFrameManager,
			mockRights as MachineRightsType
		);

		expect(manager.verbs.explorer).toBeDefined();
		expect(manager.verbs.create).toBeDefined();
		expect(manager.verbs.dashboard).toBeDefined();
	});

	it('allows registering custom launch verbs', () => {
		const manager = new IdaeMenuManager(
			mockFramer as MachineFrameManager,
			mockRights as MachineRightsType
		);

		const customVerb = vi.fn();
		manager.registerVerb('custom', customVerb);

		expect(manager.verbs.custom).toBe(customVerb);
	});

	it('launch method calls the appropriate verb', () => {
		const manager = new IdaeMenuManager(
			mockFramer as MachineFrameManager,
			mockRights as MachineRightsType
		);

		const customVerb = vi.fn();
		manager.registerVerb('test', customVerb);

		manager.launch('test', '123');

		expect(customVerb).toHaveBeenCalledWith('test', '123', undefined);
	});

	it('launch method falls back to explorer for unknown collections', () => {
		const manager = new IdaeMenuManager(
			mockFramer as MachineFrameManager,
			mockRights as MachineRightsType
		);

		const mockExplorer = vi.fn();
		manager.verbs.explorer = mockExplorer;

		manager.launch('unknown');

		expect(mockExplorer).toHaveBeenCalledWith('unknown', undefined, undefined);
	});

	it('getTree returns an empty tree before a snapshot reader is wired', () => {
		const manager = new IdaeMenuManager(
			mockFramer as MachineFrameManager,
			mockRights as MachineRightsType
		);

		expect(manager.getTree('side')).toEqual({ zone: 'side', groups: [] });
	});

	it('getTree builds from the injected snapshot reader once wired', () => {
		const manager = new IdaeMenuManager(
			mockFramer as MachineFrameManager,
			mockRights as MachineRightsType
		);

		manager.setSnapshotReader(() => ({
			prefs: {},
			appscheme: [{ code: 'users', label: 'Users', fks: { appscheme_base: { code: 'admin' } } }],
			appscheme_base: [{ code: 'admin', label: 'Administration' }],
			isDev: false
		}));

		const tree = manager.getTree('side');
		expect(tree.groups.length).toBe(1);
		expect(tree.groups[0].items[0].collection).toBe('users');
	});

	it('getFlatItems flattens all groups', () => {
		const manager = new IdaeMenuManager(
			mockFramer as MachineFrameManager,
			mockRights as MachineRightsType
		);

		manager.setSnapshotReader(() => ({
			prefs: {},
			appscheme: [
				{ code: 'users', label: 'Users', fks: { appscheme_base: { code: 'admin' } } },
				{ code: 'products', label: 'Products', fks: { appscheme_base: { code: 'catalog' } } }
			],
			appscheme_base: [
				{ code: 'admin', label: 'Administration' },
				{ code: 'catalog', label: 'Catalog' }
			],
			isDev: false
		}));

		expect(manager.getFlatItems('side').map((i) => i.collection).sort()).toEqual(['products', 'users']);
	});

	it('isVisible respects rights — collections outside allowedCollections are absent', () => {
		const manager = new IdaeMenuManager(
			mockFramer as MachineFrameManager,
			mockRights as MachineRightsType
		);

		manager.setSnapshotReader(() => ({
			prefs: {},
			appscheme: [
				{ code: 'users', label: 'Users', fks: { appscheme_base: { code: 'admin' } } },
				{ code: 'orders', label: 'Orders', fks: { appscheme_base: { code: 'sales' } } }
			],
			appscheme_base: [
				{ code: 'admin', label: 'Administration' },
				{ code: 'sales', label: 'Sales' }
			],
			isDev: false
		}));

		// mockRights.allowedCollections only returns ['users', 'products'] — 'orders' is excluded.
		expect(manager.isVisible('users', 'side')).toBe(true);
		expect(manager.isVisible('orders', 'side')).toBe(false);
	});
});
