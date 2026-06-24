import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { MachineModel } from '$lib/types/index.js';
import Today from '../Today.svelte';
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
		fields: {
			id: { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			dateDebut: { type: 'date' },
			dateFin: { type: 'date' }
		},
		fkRelations: { appuser: { code: 'appuser', multiple: false, required: false } },
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
		fks: { appscheme_type: { code: 'tool' } },
		fkRelations: { appuser: { code: 'appuser', multiple: false, required: false } }
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

describe('Today', () => {
	let dbName: string;

	beforeEach(async () => {
		dbName = nextDbName('today');
		await bootMachine(dbName);
	});

	afterEach(() => {
		cleanup();
		machine.destroy();
	});

	it('renders quick-create entries from the create-zone menu tree', async () => {
		render(Today);

		await waitFor(() => expect(screen.getByText('Widget')).toBeInTheDocument());
	});

	it('fires the create launch verb when a quick-create item is clicked', async () => {
		const createSpy = vi
			.spyOn(machine.menu.verbs as Record<string, (collection: string) => void>, 'create')
			.mockImplementation(() => {});

		render(Today);

		await waitFor(() => expect(screen.getByText('Widget')).toBeInTheDocument());
		await fireEvent.click(screen.getByText('Widget').closest('button')!);

		expect(createSpy).toHaveBeenCalledWith('widget');
	});

	it('shows empty placeholders when no records exist for my-lists and échéancier', async () => {
		render(Today);

		await waitFor(() => expect(screen.getByText('Widget')).toBeInTheDocument());
		const emptyPlaceholders = screen.getAllByText('—');
		expect(emptyPlaceholders.length).toBe(2);
	});

	it('lists owned widget records under my-lists', async () => {
		const userCode = `user-${dbName}`;
		await machine.collection('widget').create({ code: 'w1', fks: { appuser: { code: userCode } } });

		render(Today);

		await waitFor(() => expect(screen.getByText('w1')).toBeInTheDocument());
	});

	it('lists date-bounded widget records under échéancier', async () => {
		await machine.collection('widget').create({ code: 'w2', dateDebut: '2026-06-01', dateFin: '2999-01-01' });

		render(Today);

		await waitFor(() => expect(screen.getByText('widget')).toBeInTheDocument());
	});
});
