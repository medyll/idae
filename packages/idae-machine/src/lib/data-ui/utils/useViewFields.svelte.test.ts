import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { flushSync, tick } from 'svelte';
import type { MachineModel } from '$lib/types/index.js';
import { machine } from '$lib/main/machine.js';
import { demoScheme } from '$lib/__fixtures__/demoModel.js';
import { useViewFields } from './useViewFields.svelte.js';

let dbCounter = 0;
function nextDbName(prefix: string): string {
	dbCounter += 1;
	return `${prefix}-${dbCounter}`;
}

// Same minimal core meta as DataRecord.svelte.test.ts — appscheme_view is the
// single source useViewFields resolves field lists through.
const testCore: MachineModel = {
	appscheme:           { keyPath: '++id', base: 'machine_app', model: {}, fields: { id: { type: 'id', readonly: true }, code: { type: 'text', required: true } }, fks: {}, template: { presentation: 'code' } },
	appscheme_view_type: { keyPath: '++id', base: 'machine_app', model: {}, fields: { id: { type: 'id', readonly: true }, code: { type: 'text', required: true } }, fks: {}, template: { presentation: 'code' } },
	appscheme_field_type:{ keyPath: '++id', base: 'machine_app', model: {}, fields: { id: { type: 'id', readonly: true }, code: { type: 'text', required: true } }, fks: {}, template: { presentation: 'code' } },
	appscheme_field: {
		keyPath: '++id', base: 'machine_app', model: {},
		fields: { id: { type: 'id', readonly: true }, code: { type: 'text', required: true } },
		fks: { appscheme_field_type: { code: 'appscheme_field_type', multiple: false, required: true } },
		template: { presentation: 'code' }
	},
	appscheme_view: {
		keyPath: '++id', base: 'machine_app', model: {},
		fields: { id: { type: 'id', readonly: true }, code: { type: 'text', required: true } },
		fks: {
			appscheme:           { code: 'appscheme',           multiple: false, required: true },
			appscheme_view_type: { code: 'appscheme_view_type', multiple: false, required: true },
			appscheme_field:     { code: 'appscheme_field',     multiple: false, required: true }
		},
		template: { presentation: 'fks.appscheme.code fks.appscheme_view_type.code fks.appscheme_field.code' }
	}
};

async function seedViewFields(collectionCode: string, viewCode: string, fieldCodes: string[]): Promise<void> {
	await machine.collection('appscheme').create({ code: collectionCode, fks: {} });
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
	machine.init({ dbName, version: 1, core: testCore, business: demoScheme, sync: false });
	await machine.boot();
}

describe('useViewFields — fieldKinds projection', () => {
	beforeEach(async () => {
		await bootMachine(nextDbName('viewfields'));
	});

	afterEach(() => {
		machine.destroy();
	});

	it('tags scalar fields kind:scalar and fk fields kind:fk', async () => {
		// vehicle.fks = { category, location_office } — category is a real FK relation.
		await seedViewFields('vehicle', 'full', ['license_plate', 'model', 'category']);

		let fieldKinds: Record<string, { kind: string } | null> = {};
		const cleanup = $effect.root(() => {
			const viewFields = useViewFields(() => 'vehicle', () => 'full');
			$effect(() => {
				fieldKinds = viewFields.fieldKinds;
			});
		});
		flushSync();
		await tick();
		flushSync();

		expect(fieldKinds.license_plate?.kind).toBe('scalar');
		expect(fieldKinds.model?.kind).toBe('scalar');
		expect(fieldKinds.category?.kind).toBe('fk');

		cleanup();
	});

	it('returns an empty fieldKinds map when no collection is given', async () => {
		let fieldKinds: Record<string, unknown> = { stale: true };
		const cleanup = $effect.root(() => {
			const viewFields = useViewFields(() => undefined, () => 'full');
			$effect(() => {
				fieldKinds = viewFields.fieldKinds;
			});
		});
		flushSync();
		await tick();
		flushSync();

		expect(fieldKinds).toEqual({});

		cleanup();
	});
});
