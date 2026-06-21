// idae/codefield/__tests__/CodeFieldConvention.test.ts
// Unit tests for ensureCodeField

import { describe, it, expect } from 'vitest';
import { ensureCodeField, CODE_FIELD_NAME } from '$lib/idae/codefield/CodeFieldConvention.js';
import type { MachineModel } from '$lib/types/index.js';

describe('CodeFieldConvention', () => {
	it('CODE_FIELD_NAME is "code"', () => {
		expect(CODE_FIELD_NAME).toBe('code');
	});

	describe('ensureCodeField', () => {
		it('adds code field after id when id exists', () => {
			const model: MachineModel = {
				vehicle: {
					keyPath: '++id',
					fields: { id: { type: 'id' }, name: { type: 'text' } },
					fkRelations: {}
				}
			};
			const result = ensureCodeField(model);
			const fields = Object.keys(result.vehicle.fields);
			expect(fields).toContain('code');
			const codeIdx = fields.indexOf('code');
			const idIdx = fields.indexOf('id');
			expect(codeIdx).toBe(idIdx + 1);
		});

		it('appends code when no id field', () => {
			const model: MachineModel = {
				settings: {
					keyPath: 'key',
					fields: { key: { type: 'text' }, value: { type: 'text' } },
					fkRelations: {}
				}
			};
			const result = ensureCodeField(model);
			expect('code' in result.settings.fields).toBe(true);
		});

		it('does not overwrite existing code field', () => {
			const model: MachineModel = {
				vehicle: {
					keyPath: '++id',
					fields: { id: { type: 'id' }, code: { type: 'text' }, name: { type: 'text' } },
					fkRelations: {}
				}
			};
			const result = ensureCodeField(model);
			expect(result.vehicle.fields.code).toEqual({ type: 'text' });
		});

		it('handles empty model', () => {
			expect(ensureCodeField({})).toEqual({});
		});

		it('handles multiple collections', () => {
			const model: MachineModel = {
				a: { keyPath: '++id', fields: { id: { type: 'id' } }, fkRelations: {} },
				b: { keyPath: '++id', fields: { id: { type: 'id' }, code: { type: 'text' } }, fkRelations: {} }
			};
			const result = ensureCodeField(model);
			expect('code' in result.a.fields).toBe(true);
			expect('code' in result.b.fields).toBe(true);
		});
	});
});
