import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { flushSync, tick } from 'svelte';
import { render } from '@testing-library/svelte';
import type { MachineModel } from '$lib/types/index.js';
import { machine } from '$lib/main/machine.js';
import DataRecord from './DataRecord.svelte';

let dbCounter = 0;
function nextDbName(prefix: string): string {
	dbCounter += 1;
	return `${prefix}-${dbCounter}`;
}

// Minimal schema collections needed for DataRecord to work
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

// Core collections without appscheme_view entries
const coreModel: MachineModel = {
	machine_app_user: {
		keyPath: '++id', base: 'machine_user',
		fields: {
			id: { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			appuser_role_code: { type: 'text' }
		},
		fkRelations: {
			appuser_role: { code: 'appuser_role', multiple: false, required: true }
		},
		template: { presentation: 'name code' }
	},
	appuser_role: {
		keyPath: '++id', base: 'machine_user',
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

	await machine.collection('appscheme').create({
		code: 'machine_app_user',
		fkRelations: coreModel.machine_app_user.fkRelations
	});
	await machine.collection('appscheme').create({
		code: 'appuser_role',
		fkRelations: coreModel.appuser_role.fkRelations
	});

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

describe('DataRecord — core collections with view="fk"', () => {
	beforeEach(async () => {
		await bootMachine(nextDbName('datarecord-core'));
	});

	afterEach(() => {
		machine.destroy();
	});

	it('renders FK fields for core collections with view="fk"', async () => {
		// Create a test record with FK data
		await machine.collection('appuser_role').create({
			code: 'admin',
			name: 'Administrator'
		});
		await machine.collection('machine_app_user').create({
			code: 'john',
			name: 'John Doe',
			appuser_role_code: 'admin',
			fks: { appuser_role: { code: 'admin' } }
		});

		const { container } = render(DataRecord, {
			collection: 'machine_app_user',
			collectionId: 1,
			view: 'fk'
		});

		flushSync();
		await tick();
		flushSync();

		// Should render the FK field
		expect(container.querySelector('.field')).not.toBeNull();
		// Should show the FK field label or content
		expect(container.textContent).toContain('appuser_role');
	});
});