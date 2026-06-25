import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { MachineModel } from '$lib/types/index.js';
import MainMenu from '../MainMenu.svelte';
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
		fkRelations: { appscheme_base: { code: 'appscheme_base', multiple: false, required: false } },
		template: { presentation: 'name' }
	},
	appscheme_base: {
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
	await machine.collection('appscheme_base').create({ code: 'tool', name: 'Tools', fks: {} });
	await machine.collection('appscheme').create({
		code: 'widget',
		name: 'Widget',
		icon: '🔧',
		fks: { appscheme_base: { code: 'tool' } }
	});
	await machine.collection('appscheme').create({
		code: 'gadget',
		name: 'Gadget',
		fks: { appscheme_base: { code: 'tool' } }
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

describe('MainMenu', () => {
	let dbName: string;

	beforeEach(async () => {
		dbName = nextDbName('main-menu');
		await bootMachine(dbName);
	});

	afterEach(() => {
		cleanup();
		machine.destroy();
	});

	it('renders nothing when closed', () => {
		render(MainMenu, { props: { open: false } });
		expect(screen.queryByText('Widget')).not.toBeInTheDocument();
	});

	it('renders a vertical dock with grouped collections when open', async () => {
		render(MainMenu, { props: { open: true } });
		await waitFor(() => expect(screen.getByText('widget')).toBeInTheDocument());
		expect(screen.getByText('gadget')).toBeInTheDocument();
		expect(screen.getByText("Aujourd'hui")).toBeInTheDocument();
	});

	it('selects a collection and shows its detail in the content zone', async () => {
		render(MainMenu, { props: { open: true } });
		await waitFor(() => expect(screen.getByText('widget')).toBeInTheDocument());
		await fireEvent.click(screen.getByText('widget').closest('button')!);
		await waitFor(() => expect(screen.getByText('WIDGET')).toBeInTheDocument());
		expect(screen.getByText(/Créer widget/)).toBeInTheDocument();
	});

	it('fires the create launch verb from the collection detail', async () => {
		const createSpy = vi
			.spyOn(machine.menu.verbs as Record<string, (collection: string) => void>, 'create')
			.mockImplementation(() => {});

		render(MainMenu, { props: { open: true } });
		await waitFor(() => expect(screen.getByText('widget')).toBeInTheDocument());
		await fireEvent.click(screen.getByText('widget').closest('button')!);
		await waitFor(() => expect(screen.getByText(/Créer widget/)).toBeInTheDocument());
		await fireEvent.click(screen.getByText(/Créer widget/).closest('button')!);

		expect(createSpy).toHaveBeenCalledWith('widget');
	});
});
