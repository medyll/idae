import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { flushSync, tick } from 'svelte';
import { machine } from '$lib/main/machine.js';
import { demoScheme } from '$lib/__fixtures__/demoModel.js';

let dbCounter = 0;
function nextDb(prefix: string): string {
	dbCounter += 1;
	return `${prefix}-store-${dbCounter}`;
}

async function bootMachine(dbName: string): Promise<void> {
	machine.destroy();
	machine.init({ dbName, version: 1, business: demoScheme, sync: false });
	await machine.boot();
}

describe('machine.store — Option A (ResultSet + reactivity)', () => {
	beforeEach(async () => {
		await bootMachine(nextDb('vehicle'));
	});

	afterEach(() => {
		machine.destroy();
	});

	it('exposes ResultSet methods on items', async () => {
		await machine.collection('vehicle').create({ license_plate: 'A-1', model: 'Clio',  brand: 'Renault', year: 2020, status: 'available' });
		await machine.collection('vehicle').create({ license_plate: 'B-2', model: 'Megane', brand: 'Renault', year: 2019, status: 'available' });
		await machine.collection('vehicle').create({ license_plate: 'C-3', model: '208',    brand: 'Peugeot', year: 2021, status: 'available' });

		const cleanup = $effect.root(() => {
			const store = machine.store<Record<string, unknown>>('vehicle');

			$effect(() => {
				const items = store.records;
				expect(typeof (items as any).groupBy).toBe('function');
				expect(typeof (items as any).sortBy).toBe('function');
				expect(typeof (items as any).distinct).toBe('function');
				expect(typeof (items as any).getPage).toBe('function');

				const grouped = (items as any).groupBy('brand') as Record<string, unknown[]>;
				expect(Object.keys(grouped).sort()).toEqual(['Peugeot', 'Renault']);
				expect(grouped.Renault.length).toBe(2);

				const sorted = (items as any).sortBy({ year: 'asc' });
				expect((sorted[0] as any).year).toBe(2019);
				expect((sorted[sorted.length - 1] as any).year).toBe(2021);
			});
		});
		flushSync();
		await tick();
		cleanup();
	});

	it('re-runs $derived when an item is created (reactive snapshot)', async () => {
		let observedLen = -1;
		let runs        = 0;

		const cleanup = $effect.root(() => {
			const store = machine.store<Record<string, unknown>>('location_office');
			$effect(() => {
				observedLen = store.records.length;
				runs += 1;
			});
		});

		flushSync();
		await tick();
		const initialRuns = runs;
		const baseline    = observedLen;

		await machine.collection('location_office').create({ code: 'lo1', address: '1 rue X', city: 'Paris', country: 'FR' });

		flushSync();
		await tick();
		await tick();

		expect(observedLen).toBe(baseline + 1);
		expect(runs).toBeGreaterThan(initialRuns);

		cleanup();
	});
});
