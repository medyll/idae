import { cleanup, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import DataRecord from './DataRecord.svelte';
import { machine } from '$lib/main/machine.js';
import demoSeed, { demoScheme } from '$lib/demo/demoScheme.js';

let dbCounter = 0;
function nextDbName(prefix: string): string {
	dbCounter += 1;
	return `${prefix}-${dbCounter}`;
}

async function bootMachine(dbName: string): Promise<void> {
	machine.destroy();
	machine.rights.clearCurrentUser();
	machine.init({ dbName, version: 1, business: demoScheme, sync: false });
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
