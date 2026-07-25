import { describe, expect, it } from 'vitest';
import { diagnoseMachineModel } from '$lib/main/machineSchemaDoctor.js';
import type { MachineModel } from '$lib/types/index.js';

function model(overrides: Partial<MachineModel['vehicle']> = {}): MachineModel {
	return {
		vehicle: {
			keyPath: '++id',
			fields: {
				id: { type: 'id' },
				code: { type: 'text' },
				name: { type: 'text' },
				dateDebut: { type: 'date' },
				dateFin: { type: 'date' }
			},
			fkRelations: {},
			template: { presentation: 'name code' },
			...overrides
		}
	};
}

describe('diagnoseMachineModel', () => {
	it('accepts a coherent collection', () => {
		const report = diagnoseMachineModel(
			model({ timespan: { start: 'dateDebut', end: 'dateFin' } })
		);
		expect(report).toMatchObject({ valid: true, errors: 0, warnings: 0 });
	});

	it('reports broken index, relation and timespan contracts together', () => {
		const report = diagnoseMachineModel(
			model({
				keyPath: 'missing',
				fkRelations: { owner: { code: 'person' } },
				timespan: { start: 'name', end: 'missingDate' }
			})
		);
		expect(report.valid).toBe(false);
		expect(report.issues.map((entry) => entry.code)).toEqual(
			expect.arrayContaining([
				'missing-index-field',
				'missing-fk-target',
				'invalid-timespan-type',
				'missing-timespan-field'
			])
		);
	});

	it('reports stale presentation, view and sort fields as warnings', () => {
		const report = diagnoseMachineModel(
			model({
				template: { presentation: 'name ghost' },
				defaultSort: [{ field: 'missing', direction: 'asc' }],
				_views: { flat: [{ name: 'gone' }] }
			})
		);
		expect(report.valid).toBe(true);
		expect(report.warnings).toBe(3);
	});
});
