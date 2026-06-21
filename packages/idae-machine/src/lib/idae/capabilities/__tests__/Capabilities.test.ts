// idae/capabilities/__tests__/Capabilities.test.ts
// Unit tests for IdaeCapabilities

import { describe, it, expect, beforeEach } from 'vitest';
import { IdaeCapabilities } from '$lib/idae/capabilities/Capabilities.js';
import type { MachineModel } from '$lib/types/index.js';

function makeModel(): MachineModel {
	return {
		vehicle: {
			keyPath: '++id',
			fields: { id: { type: 'id' }, status: { type: 'text' }, type: { type: 'text' }, name: { type: 'text' } },
			fkRelations: {}
		},
		category: {
			keyPath: '++id',
			fields: { id: { type: 'id' }, etat: { type: 'text' }, kind: { type: 'text' }, group: { type: 'text' } },
			fkRelations: {}
		},
		plain: {
			keyPath: '++id',
			fields: { id: { type: 'id' }, name: { type: 'text' } },
			fkRelations: {}
		}
	};
}

describe('IdaeCapabilities', () => {
	let caps: IdaeCapabilities;
	let model: MachineModel;

	beforeEach(() => {
		caps = new IdaeCapabilities();
		model = makeModel();
		caps.initialize(model);
	});

	describe('statusField', () => {
		it('finds "status" field', () => {
			expect(caps.statusField('vehicle')).toBe('status');
		});

		it('finds "etat" as status alias', () => {
			expect(caps.statusField('category')).toBe('etat');
		});

		it('returns null when no status field', () => {
			expect(caps.statusField('plain')).toBeNull();
		});

		it('returns null for unknown collection', () => {
			expect(caps.statusField('nonexistent')).toBeNull();
		});
	});

	describe('typeField', () => {
		it('finds "type" field', () => {
			expect(caps.typeField('vehicle')).toBe('type');
		});

		it('finds "kind" as type alias', () => {
			expect(caps.typeField('category')).toBe('kind');
		});

		it('returns null when no type field', () => {
			expect(caps.typeField('plain')).toBeNull();
		});
	});

	describe('groupField', () => {
		it('finds "group" field', () => {
			expect(caps.groupField('category')).toBe('group');
		});

		it('returns null when no group field', () => {
			expect(caps.groupField('vehicle')).toBeNull();
		});
	});

	describe('workflowOrder', () => {
		it('returns default workflow order', () => {
			const order = caps.workflowOrder('vehicle');
			expect(order).toContain('START');
			expect(order).toContain('END');
			expect(order.indexOf('START')).toBeLessThan(order.indexOf('END'));
		});
	});
});
