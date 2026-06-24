import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { MachineModel } from '$lib/types/index.js';
import WaffleMenu from '../WaffleMenu.svelte';
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
		fks: { appscheme_type: { code: 'tool' } }
	});
	await machine.collection('appscheme').create({
		code: 'gadget',
		name: 'Gadget',
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

describe('WaffleMenu', () => {
	let dbName: string;

	beforeEach(async () => {
		dbName = nextDbName('waffle');
		await bootMachine(dbName);
	});

	afterEach(() => {
		cleanup();
		machine.destroy();
	});

	it('renders nothing when closed', () => {
		render(WaffleMenu, { props: { open: false } });
		expect(screen.queryByText('Widget')).not.toBeInTheDocument();
	});

	it('renders columns by appscheme_type when open', async () => {
		render(WaffleMenu, { props: { open: true } });

		await waitFor(() => expect(screen.getByText('Tools')).toBeInTheDocument());
		expect(screen.getByText('Widget')).toBeInTheDocument();
		expect(screen.getByText('Gadget')).toBeInTheDocument();
	});

	it('fires the explorer launch verb when a single item is clicked', async () => {
		const explorerSpy = vi
			.spyOn(machine.menu.verbs as Record<string, (collection: string) => void>, 'explorer')
			.mockImplementation(() => {});

		render(WaffleMenu, { props: { open: true } });

		await waitFor(() => expect(screen.getByText('Widget')).toBeInTheDocument());
		await fireEvent.click(screen.getByText('Widget').closest('button')!);

		expect(explorerSpy).toHaveBeenCalledWith('widget');
	});

	it('launch_all fires the explorer verb for every item in a column', async () => {
		const explorerSpy = vi
			.spyOn(machine.menu.verbs as Record<string, (collection: string) => void>, 'explorer')
			.mockImplementation(() => {});

		render(WaffleMenu, { props: { open: true } });

		await waitFor(() => expect(screen.getByText('Tout ouvrir')).toBeInTheDocument());
		await fireEvent.click(screen.getByText('Tout ouvrir'));

		expect(explorerSpy).toHaveBeenCalledWith('widget');
		expect(explorerSpy).toHaveBeenCalledWith('gadget');
		expect(explorerSpy).toHaveBeenCalledTimes(2);
	});
});
