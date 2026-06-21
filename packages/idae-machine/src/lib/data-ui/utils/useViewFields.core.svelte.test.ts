import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { flushSync, tick } from 'svelte';
import type { MachineModel } from '$lib/types/index.js';
import { machine } from '$lib/main/machine.js';
import { useViewFields } from './useViewFields.svelte.js';

let dbCounter = 0;
function nextDbName(prefix: string): string {
	dbCounter += 1;
	return `${prefix}-${dbCounter}`;
}

const schemaModel: MachineModel = {
	appscheme:           { keyPath: '++id', base: 'machine_app', model: {}, fields: { id: { type: 'id', readonly: true }, code: { type: 'text', required: true } }, fkRelations: {}, template: { presentation: 'code' } },
	appscheme_view_type: { keyPath: '++id', base: 'machine_app', model: {}, fields: { id: { type: 'id', readonly: true }, code: { type: 'text', required: true } }, fkRelations: {}, template: { presentation: 'code' } },
	appscheme_field: {
		keyPath: '++id', base: 'machine_app', model: {},
		fields: { id: { type: 'id', readonly: true }, code: { type: 'text', required: true } },
		fkRelations: {},
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

const coreModel: MachineModel = {
	machine_app_user: {
		keyPath: '++id', base: 'machine_user',
		fields: {
			id: { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true }
		},
		fkRelations: {
			appuser_role: { code: 'appuser_role', multiple: false, required: true }
		},
		template: { presentation: 'name code' }
	},
	machine_ai_tag: {
		keyPath: '++id', base: 'machine_ai',
		fields: {
			id: { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true }
		},
		fkRelations: {},
		template: { presentation: 'name code' }
	}
};

async function bootMachine(dbName: string): Promise<void> {
	machine.destroy();
	machine.init({ dbName, version: 1, core: { ...schemaModel, ...coreModel }, business: {}, sync: false });
	await machine.boot();

	await machine.collection('appscheme').create({ code: 'machine_app_user', fkRelations: coreModel.machine_app_user.fkRelations });
	await machine.collection('appscheme').create({ code: 'machine_ai_tag', fkRelations: coreModel.machine_ai_tag.fkRelations });

	await machine.collection('appscheme_field').create({ code: 'appuser_role' });

	await machine.collection('appscheme_view_type').create({ code: 'fk' });

	await machine.collection('appscheme_view').create({
		code: 'machine_app_user_fk_appuser_role',
		order: 1,
		fks: {
			appscheme:           { code: 'machine_app_user' },
			appscheme_view_type: { code: 'fk' },
			appscheme_field:     { code: 'appuser_role' }
		}
	});
}

describe('useViewFields — core collections via appscheme_view', () => {
	beforeEach(async () => {
		await bootMachine(nextDbName('core-views'));
	});

	afterEach(() => {
		machine.destroy();
	});

	it('returns FK fields for core collections with view="fk" from appscheme_view', async () => {
		let fieldNames: string[] = [];
		const cleanup = $effect.root(() => {
			const viewFields = useViewFields(() => 'machine_app_user', () => 'fk');
			$effect(() => {
				fieldNames = viewFields.fieldNames;
			});
		});
		flushSync();
		await tick();
		flushSync();

		expect(fieldNames).toEqual(['appuser_role']);

		cleanup();
	});

	it('returns empty array when no appscheme_view entries exist', async () => {
		let fieldNames: string[] = [];
		const cleanup = $effect.root(() => {
			const viewFields = useViewFields(() => 'machine_ai_tag', () => 'fk');
			$effect(() => {
				fieldNames = viewFields.fieldNames;
			});
		});
		flushSync();
		await tick();
		flushSync();

		expect(fieldNames).toEqual([]);

		cleanup();
	});
});
