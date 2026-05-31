import { cleanup, render, screen } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import DataFkValue from './DataFkValue.svelte';
import DataRecord from '$lib/data-ui/data/DataRecord.svelte';
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
		id: 'user-1', code: 'user-1', name: 'User One',
		isActive: true, isLocked: false, appPermissions: { ADMIN: true }
	} as never);
}

async function seedCollection(name: keyof typeof demoSeed): Promise<void> {
	for (const record of demoSeed[name]) {
		const r = record as Record<string, unknown>;
		const withCode =
			(r.code === undefined || r.code === null || r.code === '') && r.id != null
				? { ...r, code: String(r.id) }
				: r;
		await machine.collection(name).create(withCode);
	}
}

describe('DataFkValue + DataRecord view="fk"', () => {
	beforeEach(async () => {
		await bootMachine(nextDbName('datafkvalue'));
		await seedCollection('category');
		await seedCollection('location_office');
		await seedCollection('vehicle');
	});

	afterEach(() => {
		cleanup();
		machine.destroy();
		machine.rights.clearCurrentUser();
	});

	it('resolves an FK field to the target presentation string', async () => {
		// vehicle #1 → category 'compact' → category.template.presentation = 'name' → 'Compact'
		render(DataFkValue, {
			collection: 'vehicle',
			fieldName: 'category',
			data: { category: 'compact' }
		});
		expect(await screen.findByText('Compact')).not.toBeNull();
	});

	it('renders one row per FK field with the target presentation value (view="fk")', async () => {
		render(DataRecord, { collection: 'vehicle', collectionId: 1, view: 'fk' });
		// category FK resolved to its presentation
		expect(await screen.findByText('Compact')).not.toBeNull();
		// label = target collection name (appscheme store empty in jsdom → falls back to collection key)
		expect(await screen.findByText('category')).not.toBeNull();
		expect(await screen.findByText('location_office')).not.toBeNull();
	});

	it('falls back to the raw value when the FK target is absent from the store', async () => {
		render(DataFkValue, {
			collection: 'vehicle',
			fieldName: 'category',
			data: { category: 'does-not-exist' }
		});
		expect(await screen.findByText('does-not-exist')).not.toBeNull();
	});
});
