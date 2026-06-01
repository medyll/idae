import { cleanup, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { MachineModel } from '$lib/types/index.js';
import DataList from './DataList.svelte';
import DataListFk from './DataListFk.svelte';
import DataListRfk from './DataListRfk.svelte';
import { machine } from '$lib/main/machine.js';
import demoSeed, { demoScheme } from '$lib/demo/demoScheme.js';

let dbCounter = 0;

function nextDbName(prefix: string): string {
	dbCounter += 1;
	return `${prefix}-${dbCounter}`;
}

const testCore: MachineModel = {
	appuser_prefs: {
		keyPath: '++id',
		base: 'machine_user',
		model: {},
		fields: {
			id: { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text' },
			value: { type: 'text' }
		},
		fks: {},
		template: { presentation: 'code' }
	}
};

async function bootMachine(dbName: string): Promise<void> {
	machine.destroy();
	machine.rights.clearCurrentUser();
	machine.init({ dbName, version: 1, core: testCore, business: demoScheme, sync: false });
	await machine.boot();
	machine.rights.setCurrentUser({
		id: 'user-1',
		code: 'user-1',
		name: 'User One',
		isActive: true,
		isLocked: false,
		appPermissions: {}
	} as never);
}

async function seedCollection(name: keyof typeof demoSeed): Promise<void> {
	for (const record of demoSeed[name]) {
		const r = record as Record<string, unknown>;
		// Mirror the seed path: auto-construct code = String(id) when absent.
		const withCode =
			(r.code === undefined || r.code === null || r.code === '') && r.id != null
				? { ...r, code: String(r.id) }
				: r;
		await machine.collection(name).create(withCode);
	}
}

async function seedDemoRelations(): Promise<void> {
	await seedCollection('category');
	await seedCollection('location_office');
	await seedCollection('vehicle');
	await seedCollection('customer');
	await seedCollection('rental');
	await seedCollection('maintenance');
}

async function seedFindPref(scope: string, value: Record<string, unknown>): Promise<void> {
	const scopeKey = `${scope}.find`;
	await machine.action(
		'appuser_prefs',
		{ scopeKey, name: scopeKey, value },
		{ code: '{userId}:{scopeKey}', upsertOn: ['code'] }
	);
}

describe('DataList relation components', () => {
	afterEach(() => {
		cleanup();
		machine.destroy();
		machine.rights.clearCurrentUser();
	});

	describe('DataList prefs gating', () => {
		beforeEach(async () => {
			await bootMachine(nextDbName('datalist-prefs'));
			await machine.collection('vehicle').create({
				license_plate: 'AA-111-BB',
				model: 'Clio',
				brand: 'Renault',
				year: 2018,
				status: 'available'
			});
		});

		it('ignores persisted finder prefs when usePrefs is false', async () => {
			await seedFindPref('datalist.vehicle', { status: 'retired' });
			render(DataList, { collection: 'vehicle', usePrefs: false });
			expect(await screen.findByText(/AA-111-BB/)).not.toBeNull();
		});

		it('uses a custom prefsScope instead of the default collection scope', async () => {
			await seedFindPref('datalist.vehicle', { status: 'retired' });
			render(DataList, { collection: 'vehicle', prefsScope: 'relations.vehicle' });
			expect(await screen.findByText(/AA-111-BB/)).not.toBeNull();
		});

		it('hydrates persisted finder prefs by default', async () => {
			await seedFindPref('datalist.vehicle', { status: 'retired' });
			render(DataList, { collection: 'vehicle' });
			await waitFor(() => {
				expect(screen.queryByText(/AA-111-BB/)).toBeNull();
			});
		});

		it('forces stack layout in list mode even when a grid listClass is provided', async () => {
			render(DataList, {
				collection: 'vehicle',
				listClass: 'list list-grid'
			});
			const list = await screen.findByRole('list');
			expect(list.classList.contains('list')).toBe(true);
			expect(list.classList.contains('list-stack')).toBe(true);
			expect(list.classList.contains('list-grid')).toBe(false);
		});
	});

	describe('DataListFk', () => {
		beforeEach(async () => {
			await bootMachine(nextDbName('datalist-fk'));
			await seedDemoRelations();
		});

		it('renders forward related collections for a source record', async () => {
			render(DataListFk, { collection: 'vehicle', recordId: 1 });
			expect(await screen.findByText('Compact')).not.toBeNull();
			expect(await screen.findByText(/PAR-01/)).not.toBeNull();
		});

		it('filters to a single FK relation', async () => {
			render(DataListFk, { collection: 'vehicle', recordId: 1, fk: 'category' });
			expect(await screen.findByText('Compact')).not.toBeNull();
			await waitFor(() => {
				expect(screen.queryByText(/PAR-01/)).toBeNull();
			});
		});

		it('does not inherit persisted target prefs by default', async () => {
			await seedFindPref('datalist.category', { name: 'Missing category' });
			render(DataListFk, { collection: 'vehicle', recordId: 1, fk: 'category' });
			expect(await screen.findByText('Compact')).not.toBeNull();
		});
	});

	describe('DataListRfk', () => {
		beforeEach(async () => {
			await bootMachine(nextDbName('datalist-rfk'));
			await seedDemoRelations();
		});

		it('renders reverse related collections for a source record', async () => {
			render(DataListRfk, { collection: 'category', recordId: 1 });
			expect(await screen.findByText(/AA-111-BB/)).not.toBeNull();
			expect(await screen.findByText(/CC-222-DD/)).not.toBeNull();
		});

		it('filters to a single reverse relation', async () => {
			render(DataListRfk, { collection: 'vehicle', recordId: 2, fk: 'rental' });
			expect(await screen.findByText(/completed/)).not.toBeNull();
			await waitFor(() => {
				expect(screen.queryByText(/oil change/)).toBeNull();
			});
		});

		it('does not inherit persisted reverse-target prefs by default', async () => {
			await seedFindPref('datalist.vehicle', { status: 'retired' });
			render(DataListRfk, { collection: 'category', recordId: 1 });
			expect(await screen.findByText(/AA-111-BB/)).not.toBeNull();
		});
	});
});
