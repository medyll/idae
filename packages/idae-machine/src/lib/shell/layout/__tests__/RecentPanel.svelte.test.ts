import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { MachineModel } from '$lib/types/index.js';
import RecentPanel from '../RecentPanel.svelte';
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
	},
	appuser_history: {
		keyPath: '++id',
		base: 'machine_user',
		model: {},
		fields: {
			id: { type: 'id', readonly: true },
			collection: { type: 'text', required: true },
			collection_value: { type: 'text', required: true },
			label: { type: 'text' },
			count: { type: 'number' },
			lastSeen: { type: 'text' }
		},
		fkRelations: {},
		template: { presentation: 'collection label lastSeen' }
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
	} as never
};

async function seedMenuFixtures(): Promise<void> {
	await machine.collection('appscheme_type').create({ code: 'tool', name: 'Tools', fks: {} });
	await machine.collection('appscheme').create({
		code: 'widget',
		name: 'Widget',
		icon: '🔧',
		fks: { appscheme_type: { code: 'tool' } }
	});
}

async function bootMachine(dbName: string): Promise<string> {
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

describe('RecentPanel', () => {
	let dbName: string;

	beforeEach(async () => {
		dbName = nextDbName('recent-panel');
		await bootMachine(dbName);
	});

	afterEach(() => {
		cleanup();
		machine.destroy();
	});

	it('shows an empty placeholder when no history exists', async () => {
		render(RecentPanel, { props: { zone: 'panel' } });

		await waitFor(() => expect(screen.getByText('—')).toBeInTheDocument());
	});

	it('lists a recent widget visit grouped under its appscheme_type label', async () => {
		await machine.collection('appuser_history').create({
			collection: 'widget',
			collection_value: 'w1',
			label: 'Widget One',
			count: 1,
			lastSeen: new Date().toISOString()
		});

		render(RecentPanel, { props: { zone: 'panel' } });

		await waitFor(() => expect(screen.getByText('Tools')).toBeInTheDocument());
		expect(screen.getByText('Widget One')).toBeInTheDocument();
	});

	it('excludes history entries older than 30 days', async () => {
		const old = new Date();
		old.setDate(old.getDate() - 45);
		await machine.collection('appuser_history').create({
			collection: 'widget',
			collection_value: 'w-old',
			label: 'Stale Widget',
			count: 1,
			lastSeen: old.toISOString()
		});

		render(RecentPanel, { props: { zone: 'panel' } });

		await waitFor(() => expect(screen.getByText('—')).toBeInTheDocument());
		expect(screen.queryByText('Stale Widget')).not.toBeInTheDocument();
	});

	it('navigates via machine.menu.verbs.fiche when an item is clicked', async () => {
		const ficheSpy = vi
			.spyOn(machine.menu.verbs as Record<string, (collection: string, id?: unknown) => void>, 'fiche')
			.mockImplementation(() => {});

		await machine.collection('appuser_history').create({
			collection: 'widget',
			collection_value: 'w1',
			label: 'Widget One',
			count: 1,
			lastSeen: new Date().toISOString()
		});

		render(RecentPanel, { props: { zone: 'panel' } });

		await waitFor(() => expect(screen.getByText('Widget One')).toBeInTheDocument());
		await fireEvent.click(screen.getByText('Widget One').closest('button')!);

		expect(ficheSpy).toHaveBeenCalledWith('widget', 'w1');
	});
});
