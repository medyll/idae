/**
 * MachineMenuManager tests — unit tests for the menu manager facade.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readable } from 'svelte/store';
import { MachineMenuManager } from '../MachineMenuManager.js';
import type { MachineFrameManager } from '$lib/main/frame/MachineFrameManager.js';
import type { MachineRights as MachineRightsType } from '$lib/main/machine/MachineRights.js';

describe('MachineMenuManager', () => {
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
		const manager = new MachineMenuManager(
			mockFramer as MachineFrameManager,
			mockRights as MachineRightsType
		);

		expect(manager).toBeDefined();
		expect(manager.framer).toBe(mockFramer);
		expect(manager.rights).toBe(mockRights);
	});

	it('has default launch verbs', () => {
		const manager = new MachineMenuManager(
			mockFramer as MachineFrameManager,
			mockRights as MachineRightsType
		);

		expect(manager.verbs.explorer).toBeDefined();
		expect(manager.verbs.create).toBeDefined();
		expect(manager.verbs.dashboard).toBeDefined();
	});

	it('allows registering custom launch verbs', () => {
		const manager = new MachineMenuManager(
			mockFramer as MachineFrameManager,
			mockRights as MachineRightsType
		);

		const customVerb = vi.fn();
		manager.registerVerb('custom', customVerb);

		expect(manager.verbs.custom).toBe(customVerb);
	});

	it('launch method calls the appropriate verb', () => {
		const manager = new MachineMenuManager(
			mockFramer as MachineFrameManager,
			mockRights as MachineRightsType
		);

		const customVerb = vi.fn();
		manager.registerVerb('test', customVerb);

		manager.launch('test', '123');

		expect(customVerb).toHaveBeenCalledWith('test', '123', undefined);
	});

	it('launch method falls back to explorer for unknown collections', () => {
		const manager = new MachineMenuManager(
			mockFramer as MachineFrameManager,
			mockRights as MachineRightsType
		);

		// Mock the explorer verb to track calls
		const originalExplorer = manager.verbs.explorer;
		const mockExplorer = vi.fn();
		manager.verbs.explorer = mockExplorer;

		manager.launch('unknown');

		expect(mockExplorer).toHaveBeenCalledWith('unknown', undefined, undefined);
		
		// Restore original
		manager.verbs.explorer = originalExplorer;
	});

	it('wireStores creates menu stores for all zones', () => {
		const manager = new MachineMenuManager(
			mockFramer as MachineFrameManager,
			mockRights as MachineRightsType
		);

		const mockPrefs = readable({});
		const mockAppscheme = readable(new Map([
			['users', { code: 'users', label: 'Users', fks: { appscheme_type: { code: 'admin' } } }]
		]));
		const mockAppschemeType = readable(new Map([
			['admin', { code: 'admin', label: 'Administration' }]
		]));
		const mockIsDev = readable(false);

		manager.wireStores({
			rights: mockRights as MachineRightsType,
			prefs: mockPrefs,
			appscheme: mockAppscheme,
			appscheme_type: mockAppschemeType,
			isDev: mockIsDev
		});

		expect(manager.stores.side).toBeDefined();
		expect(manager.stores.start).toBeDefined();
		expect(manager.stores.create).toBeDefined();
		expect(manager.stores.panel).toBeDefined();
	});
});