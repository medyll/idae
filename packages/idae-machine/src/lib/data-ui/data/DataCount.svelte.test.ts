import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { flushSync, tick } from 'svelte';
import { cleanup, render } from '@testing-library/svelte';
import type { MachineModel } from '$lib/types/index.js';
import { machine } from '$lib/main/machine.js';
import DataCount from './DataCount.svelte';

// DataCount reads the `machine` singleton, so tests cannot swap in an isolated Machine
// instance the way the machineDb suites do. Records also survive machine.destroy() +
// a fresh IDBFactory (verified: a re-booted singleton still reads the previous test's
// rows), so isolation comes from giving each test its own collection instead.
const COLLECTIONS = ['w_total', 'w_where', 'w_filter', 'w_reactive', 'w_empty'] as const;

const model: MachineModel = Object.fromEntries(
	COLLECTIONS.map((name) => [
		name,
		{
			keyPath: '++id',
			base: 'machine_base',
			fields: {
				id:     { type: 'id', readonly: true },
				code:   { type: 'text', required: true },
				status: { type: 'text' }
			},
			fkRelations: {},
			template: { presentation: 'code' }
		}
	])
) as MachineModel;

async function settle(): Promise<void> {
	flushSync();
	await tick();
	flushSync();
	await tick();
}

function countText(container: HTMLElement): string | undefined {
	return container.querySelector('.data-count-value')?.textContent ?? undefined;
}

describe('DataCount', () => {
	beforeEach(async () => {
		machine.destroy();
		machine.init({ dbName: 'datacount', version: 1, core: model, business: {}, sync: false });
		await machine.boot();
	});

	afterEach(() => {
		// Unmount before destroying: a live DataCount keeps its machine.store subscription.
		cleanup();
		machine.destroy();
	});

	it('renders the collection total with its label', async () => {
		await machine.collection('w_total').create({ code: 'a', status: 'open' });
		await machine.collection('w_total').create({ code: 'b', status: 'done' });

		const { container } = render(DataCount, { collection: 'w_total', label: 'Total' });
		await settle();

		expect(container.querySelector('.data-count-label')?.textContent).toBe('Total');
		expect(countText(container)).toBe('2');
	});

	it('narrows the count with a static where', async () => {
		await machine.collection('w_where').create({ code: 'a', status: 'open' });
		await machine.collection('w_where').create({ code: 'b', status: 'done' });
		await machine.collection('w_where').create({ code: 'c', status: 'open' });

		const { container } = render(DataCount, {
			collection: 'w_where',
			where: { status: 'open' }
		});
		await settle();

		expect(countText(container)).toBe('2');
	});

	it('applies the client-side filter predicate on top of the store records', async () => {
		await machine.collection('w_filter').create({ code: 'keep', status: 'open' });
		await machine.collection('w_filter').create({ code: 'drop', status: 'open' });

		const { container } = render(DataCount, {
			collection: 'w_filter',
			filter: (record: Record<string, unknown>) => record.code === 'keep'
		});
		await settle();

		expect(countText(container)).toBe('1');
	});

	it('reacts to records created after mount', async () => {
		await machine.collection('w_reactive').create({ code: 'a' });

		const { container } = render(DataCount, { collection: 'w_reactive' });
		await settle();
		expect(countText(container)).toBe('1');

		await machine.collection('w_reactive').create({ code: 'b' });
		await settle();

		expect(countText(container)).toBe('2');
	});

	it('renders zero for an empty collection', async () => {
		const { container } = render(DataCount, { collection: 'w_empty' });
		await settle();

		expect(countText(container)).toBe('0');
	});
});
