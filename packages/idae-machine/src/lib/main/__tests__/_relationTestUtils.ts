/**
 * Test helpers for the appscheme-backed relation model (FKRELATIONS.md).
 *
 * Relations are read from the `appscheme[collection].fkRelations` record — never
 * from the in-memory model. The relation accessor (`getCollectionRelations`)
 * reads the GLOBAL `machine` singleton's appscheme qoolie collection, so tests
 * must drive that same global instance (not a `new Machine()`), boot it with an
 * `appscheme` collection, and seed one appscheme record per business collection.
 * This mirrors what `publishModel` does server-side: move the authoring
 * `fkRelations` declaration onto the appscheme record.
 */
import { IDBFactory } from 'fake-indexeddb';
import { machine } from '$lib/main/machine.js';
import type { MachineModel } from '$lib/types/index.js';

let _dbCounter = 0;

/** Fresh IDB + unique db name so each boot of the shared global machine is isolated. */
export function resetIndexedDB(): void {
	(globalThis as any).indexedDB = new IDBFactory();
}
export function uniqueDbName(base: string): string {
	return `${base}-${++_dbCounter}`;
}

/** Inject an `appscheme` collection (base machine_app) so the relation accessor has a store. */
export function withAppscheme(model: MachineModel): MachineModel {
	return {
		appscheme: {
			keyPath: '++id',
			base:    'machine_app',
			model:   {},
			fields: {
				id:   { type: 'id',   readonly: true },
				code: { type: 'text', required: true },
			},
			fkRelations: {},
			template: { presentation: 'code' },
		} as any,
		...model,
	};
}

/**
 * Boot the global `machine` with `model` (+ an appscheme collection) and seed one
 * appscheme record per collection carrying its authoring `fkRelations`. Returns the
 * booted global machine. Reads of relations then resolve from the appscheme store.
 */
export async function bootWithRelations(dbName: string, model: MachineModel) {
	resetIndexedDB();
	machine.init({ dbName: uniqueDbName(dbName), version: 1, business: withAppscheme(model) });
	await machine.boot();
	for (const [code, def] of Object.entries(model)) {
		const fkRelations = (def as any).fkRelations ?? {};
		await machine.collection('appscheme').create({ code, fkRelations });
	}
	return machine;
}
