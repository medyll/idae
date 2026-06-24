import { cleanup, render } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { MachineModel } from '$lib/types/index.js';
import { machine } from '$lib/main/machine.js';
import HostProbe from './HostProbe.svelte';

let dbCounter = 0;
function nextDbName(prefix: string): string {
	dbCounter += 1;
	return `${prefix}-${dbCounter}`;
}

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

async function bootMachine(dbName: string): Promise<void> {
	machine.destroy();
	machine.rights.clearCurrentUser();
	machine.init({ dbName, version: 1, core: {}, business: businessScheme, sync: false });
	await machine.boot();
	machine.rights.setCurrentUser({
		id: `user-${dbName}`,
		code: `user-${dbName}`,
		name: 'User One',
		isActive: true,
		isLocked: false,
		appPermissions: {}
	} as never);
}

describe('useRecordData', () => {
	let dbName: string;

	beforeEach(async () => {
		dbName = nextDbName('use-record-data');
		await bootMachine(dbName);
	});

	afterEach(() => {
		cleanup();
		machine.destroy();
	});

	it('uses the data prop as-is when provided (controlled)', () => {
		const { getByTestId } = render(HostProbe, {
			props: { collection: 'widget', data: { id: 1, code: 'controlled' } }
		});
		expect(getByTestId('code').textContent).toBe('controlled');
		expect(getByTestId('collectionId').textContent).toBe('1');
	});

	it('reads the record reactively via machine.store when only collectionId is given', async () => {
		const created = (await machine.collection('widget').create({ code: 'fetched' })) as { id: unknown };

		const { getByTestId } = render(HostProbe, {
			props: { collection: 'widget', collectionId: created.id as string | number }
		});

		expect(getByTestId('code').textContent).toBe('fetched');
	});

	it('returns undefined record when neither data nor collectionId resolve a row', () => {
		const { getByTestId } = render(HostProbe, {
			props: { collection: 'widget', collectionId: 'missing' }
		});
		expect(getByTestId('code').textContent).toBe('');
	});
});
