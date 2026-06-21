import { cleanup, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { MachineModel } from '$lib/types/index.js';
import DataRecord from './DataRecord.svelte';
import { machine } from '$lib/main/machine.js';
import demoSeed, { demoScheme } from '$lib/__fixtures__/demoModel.js';

let dbCounter = 0;
function nextDbName(prefix: string): string {
	dbCounter += 1;
	return `${prefix}-${dbCounter}`;
}

// Minimal appscheme_view/appscheme_field/appscheme_field_type core meta —
// DataRecord resolves its field list through these (see useViewFields), no fallback.
const testCore: MachineModel = {
	appscheme:           { keyPath: '++id', base: 'machine_app', model: {}, fields: { id: { type: 'id', readonly: true }, code: { type: 'text', required: true } }, fkRelations: {}, template: { presentation: 'code' } },
	appscheme_view_type: { keyPath: '++id', base: 'machine_app', model: {}, fields: { id: { type: 'id', readonly: true }, code: { type: 'text', required: true } }, fkRelations: {}, template: { presentation: 'code' } },
	appscheme_field_type:{ keyPath: '++id', base: 'machine_app', model: {}, fields: { id: { type: 'id', readonly: true }, code: { type: 'text', required: true } }, fkRelations: {}, template: { presentation: 'code' } },
	appscheme_field: {
		keyPath: '++id', base: 'machine_app', model: {},
		fields: { id: { type: 'id', readonly: true }, code: { type: 'text', required: true } },
		fkRelations: { appscheme_field_type: { code: 'appscheme_field_type', multiple: false, required: true } },
		template: { presentation: 'code' }
	},
	appscheme_view: {
		keyPath: '++id', base: 'machine_app', model: {},
		fields: { id: { type: 'id', readonly: true }, code: { type: 'text', required: true } },
		fkRelations: {
			appscheme:           { code: 'appscheme',           multiple: false, required: true },
			appscheme_view_type: { code: 'appscheme_view_type', multiple: false, required: true },
			appscheme_field:     { code: 'appscheme_field',     multiple: false, required: true }
		},
		template: { presentation: 'fks.appscheme.code fks.appscheme_view_type.code fks.appscheme_field.code' }
	}
};

const VEHICLE_FULL_VIEW_FIELDS = ['license_plate', 'model', 'brand', 'year', 'status'];

async function seedViewFields(collectionCode: string, viewCode: string, fieldCodes: string[]): Promise<void> {
	// appscheme record carries the collection's fkRelations (source of truth — FKRELATIONS.md).
	await machine.collection('appscheme').create({
		code: collectionCode,
		fks: {},
		fkRelations: (demoScheme as any)[collectionCode]?.fkRelations ?? {},
	});
	await machine.collection('appscheme_view_type').create({ code: viewCode, fks: {} });
	await machine.collection('appscheme_field_type').create({ code: 'scalar', fks: {} });
	for (const code of fieldCodes) {
		await machine.collection('appscheme_field').create({
			code,
			fks: { appscheme_field_type: { code: 'scalar' } }
		});
		await machine.collection('appscheme_view').create({
			code: `${collectionCode}.${viewCode}.${code}`,
			fks: {
				appscheme: { code: collectionCode },
				appscheme_view_type: { code: viewCode },
				appscheme_field: { code }
			}
		});
	}
}

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
	await seedViewFields('vehicle', 'full', VEHICLE_FULL_VIEW_FIELDS);
}

describe('DataRecord data source contract', () => {
	beforeEach(async () => {
		await bootMachine(nextDbName('datarecord'));
	});

	afterEach(() => {
		cleanup();
		machine.destroy();
		machine.rights.clearCurrentUser();
	});

	it('reads the record reactively from machine.store via collectionId', async () => {
		await machine.collection('vehicle').create({
			license_plate: 'AA-111-BB',
			model: 'Clio',
			brand: 'Renault',
			year: 2018,
			status: 'available'
		});

		render(DataRecord, { collection: 'vehicle', collectionId: 1 });

		// All fields present in the fetched record render (no data prop passed) —
		// proves the store-backed source contract delivers the full record.
		expect(await screen.findByText('license_plate')).not.toBeNull();
		expect(screen.getByText('model')).not.toBeNull();
		expect(screen.getByText('brand')).not.toBeNull();
		expect(screen.getByText('year')).not.toBeNull();
		expect(screen.getByText('status')).not.toBeNull();
	});

	it('skips fields absent from a sparse record without throwing FIELD_NOT_FOUND', async () => {
		// Record intentionally missing several scheme fields (brand, year).
		await machine.collection('vehicle').create({
			license_plate: 'CC-222-DD',
			model: 'Megane',
			status: 'available'
		});

		render(DataRecord, { collection: 'vehicle', collectionId: 1 });

		// Present fields render; absent fields are skipped (not just blank) —
		// this is the guard that prevents FIELD_NOT_FOUND.
		expect(await screen.findByText('license_plate')).not.toBeNull();
		expect(screen.getByText('model')).not.toBeNull();
		expect(screen.queryByText('brand')).toBeNull();
		expect(screen.queryByText('year')).toBeNull();
	});

	it('uses the data prop as-is when provided (controlled, no fetch)', async () => {
		render(DataRecord, {
			collection: 'vehicle',
			data: { id: 99, license_plate: 'ZZ-999-ZZ', model: 'Twingo' }
		});
		expect(await screen.findByText('license_plate')).not.toBeNull();
		expect(screen.getByText('model')).not.toBeNull();
		// Field absent from the controlled data object is skipped.
		expect(screen.queryByText('status')).toBeNull();
	});
});
