import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { MachineModel } from '$lib/types/index.js';
import MenuSettings from '../MenuSettings.svelte';
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
	} as never
};

async function seedFixtures(): Promise<void> {
	await machine.collection('appscheme').create({ code: 'widget', name: 'Widget', fks: {} });
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
	await seedFixtures();
	return userId;
}

describe('MenuSettings', () => {
	let dbName: string;
	let userId: string;

	beforeEach(async () => {
		dbName = nextDbName('menu-settings');
		userId = await bootMachine(dbName);
	});

	afterEach(() => {
		cleanup();
		machine.destroy();
	});

	it('renders nothing when closed', () => {
		render(MenuSettings, { props: { open: false } });
		expect(screen.queryByText('Widget')).not.toBeInTheDocument();
	});

	it('shows the warning and the default-hidden toggle when no prefs are configured', async () => {
		render(MenuSettings, { props: { open: true } });

		await waitFor(() => expect(screen.getByText('Widget')).toBeInTheDocument());
		expect(screen.getByText(/Aucune préférence configurée/)).toBeInTheDocument();
		expect(screen.getByText('Widget').closest('button')).toHaveAttribute('aria-pressed', 'false');
	});

	it('toggling a hidden collection writes appuser_prefs via machine.action and shows it', async () => {
		render(MenuSettings, { props: { open: true } });

		await waitFor(() => expect(screen.getByText('Widget')).toBeInTheDocument());
		const toggle = screen.getByText('Widget').closest('button')!;
		expect(toggle).toHaveAttribute('aria-pressed', 'false');
		await fireEvent.click(toggle);

		await waitFor(() => expect(toggle).toHaveAttribute('aria-pressed', 'true'));

		const prefs = (await machine.collection('appuser_prefs').where({})) as Array<{ code: string; value: unknown }>;
		const pref = prefs.find((p) => p.code === `${userId}:app_menu.widget`);
		expect(pref?.value).toBe(true);
	});

	it('switches zones via tabs', async () => {
		render(MenuSettings, { props: { open: true } });

		await waitFor(() => expect(screen.getByText('side')).toBeInTheDocument());
		await fireEvent.click(screen.getByText('start'));

		expect(screen.getByText('start').closest('button')).toHaveAttribute('aria-pressed', 'true');
		expect(screen.getByText('side').closest('button')).toHaveAttribute('aria-pressed', 'false');
	});
});
