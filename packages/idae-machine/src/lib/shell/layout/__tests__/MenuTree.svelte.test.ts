import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { MachineModel } from '$lib/types/index.js';
import MenuTree from '../MenuTree.svelte';
import { machine } from '$lib/main/machine.js';

let dbCounter = 0;
function nextDbName(prefix: string): string {
	dbCounter += 1;
	return `${prefix}-${dbCounter}`;
}

const testCore: MachineModel = {
	appscheme: {
		keyPath: '++id',
		base: 'machine_app',
		model: {},
		fields: {
			id: { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			color: { type: 'text' },
			icon: { type: 'text' }
		},
		fkRelations: { appscheme_type: { code: 'appscheme_type', multiple: false, required: false } },
		template: { presentation: 'name' }
	},
	appscheme_type: {
		keyPath: '++id',
		base: 'machine_app',
		model: {},
		fields: {
			id: { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true }
		},
		fkRelations: {},
		template: { presentation: 'name' }
	},
	appuser_prefs: {
		keyPath: '++id',
		base: 'machine_user',
		model: {},
		fields: {
			id: { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			value: { type: 'text' }
		},
		fkRelations: {},
		template: { presentation: 'code' }
	}
};

const businessScheme: MachineModel = {
	widget: {
		keyPath: '++id',
		base: 'machine_base',
		model: {},
		fields: { id: { type: 'id', readonly: true }, code: { type: 'text', required: true } },
		fkRelations: {},
		template: { presentation: 'code' },
		rights: { public: ['L'] }
	} as never,
	gadget: {
		keyPath: '++id',
		base: 'machine_base',
		model: {},
		fields: { id: { type: 'id', readonly: true }, code: { type: 'text', required: true } },
		fkRelations: {},
		template: { presentation: 'code' },
		rights: { public: ['L'] }
	} as never
};

async function seedMenuFixtures(): Promise<void> {
	await machine.collection('appscheme_type').create({ code: 'tool', name: 'Tools', fks: {} });
	await machine.collection('appscheme').create({
		code: 'widget',
		name: 'Widget',
		icon: '🔧',
		color: '#f00',
		fks: { appscheme_type: { code: 'tool' } }
	});
	await machine.collection('appscheme').create({
		code: 'gadget',
		name: 'Gadget',
		fks: { appscheme_type: { code: 'tool' } }
	});
}

async function bootMachine(dbName: string): Promise<string> {
	// idbEventBus.dataState is a module-level singleton keyed by collection name only
	// (not per Machine instance) — a fresh dbName per test does not isolate
	// appuser_prefs rows written by a previous test. Use a per-test userId so pref
	// keys (`{userId}:...`) never collide across tests in this file.
	const userId = `user-${dbName}`;
	machine.destroy();
	machine.rights.clearCurrentUser();
	machine.init({ dbName, version: 1, core: testCore, business: businessScheme, sync: false });
	await machine.boot();
	machine.rights.setCurrentUser({
		id: userId,
		code: userId,
		name: 'User One',
		isActive: true,
		isLocked: false,
		appPermissions: {}
	} as never);
	await seedMenuFixtures();
	return userId;
}

describe('MenuTree', () => {
	let dbName: string;
	let userId: string;

	beforeEach(async () => {
		dbName = nextDbName('menu-tree');
		userId = await bootMachine(dbName);
	});

	afterEach(() => {
		cleanup();
		machine.destroy();
	});

	it('renders a collapsible tree grouped by appscheme_type', async () => {
		render(MenuTree, { props: { zone: 'side', link: 'loadIn:explorer.content@frame-1' } });

		await waitFor(() => expect(screen.getByText('Tools')).toBeInTheDocument());
		expect(screen.getByText('Widget')).toBeInTheDocument();
		expect(screen.getByText('Gadget')).toBeInTheDocument();
	});

	it('collapses and re-expands a group, persisting the open state via machine.action', async () => {
		render(MenuTree, { props: { zone: 'side', link: 'loadIn:explorer.content@frame-1' } });

		await waitFor(() => expect(screen.getByText('Widget')).toBeInTheDocument());

		const toggle = screen.getByText('Tools').closest('button')!;
		await fireEvent.click(toggle);

		await waitFor(() => expect(screen.queryByText('Widget')).not.toBeInTheDocument());

		await waitFor(async () => {
			const prefs = (await machine.collection('appuser_prefs').where({})) as Array<{ code: string; value: unknown }>;
			const pref = prefs.find((p) => p.code === `${userId}:menu_tree_open.side.tool`);
			expect(pref?.value).toBe(false);
		});

		await fireEvent.click(toggle);
		await waitFor(() => expect(screen.getByText('Widget')).toBeInTheDocument());
	});

	it('navigates via machine.framer.loadIn when an item is clicked', async () => {
		const loadInSpy = vi.spyOn(machine.framer, 'loadIn').mockImplementation(() => {});

		render(MenuTree, { props: { zone: 'side', link: 'loadIn:explorer.content@frame-1' } });

		await waitFor(() => expect(screen.getByText('Widget')).toBeInTheDocument());
		await fireEvent.click(screen.getByText('Widget').closest('button')!);

		expect(loadInSpy).toHaveBeenCalledWith('frame-1', 'explorer.content', 'widget', undefined, undefined);
	});

	it('shows an empty placeholder when no collections are visible', async () => {
		machine.destroy();
		dbName = nextDbName('menu-tree-empty');
		machine.rights.clearCurrentUser();
		machine.init({ dbName, version: 1, core: testCore, business: {}, sync: false });
		await machine.boot();
		machine.rights.setCurrentUser({
			id: 'user-2',
			code: 'user-2',
			name: 'User Two',
			isActive: true,
			isLocked: false,
			appPermissions: {}
		} as never);

		render(MenuTree, { props: { zone: 'side', link: 'loadIn:explorer.content@frame-1' } });

		await waitFor(() => expect(screen.getByText('—')).toBeInTheDocument());
	});
});
