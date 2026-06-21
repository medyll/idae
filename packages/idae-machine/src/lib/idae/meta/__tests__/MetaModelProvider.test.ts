// idae/meta/__tests__/MetaModelProvider.test.ts
// Unit tests for IdaeMetaModelProvider

import { describe, it, expect, beforeEach } from 'vitest';
import { IdaeMetaModelProvider } from '$lib/idae/meta/MetaModelProvider.js';
import type { MachineModel } from '$lib/types/index.js';

function makeModel(): MachineModel {
	return {
		appscheme: {
			keyPath: '++id',
			fields: { id: { type: 'id' } },
			fkRelations: {},
			base: 'machine_app'
		},
		appscheme_field: {
			keyPath: '++id',
			fields: { id: { type: 'id' } },
			fkRelations: {},
			base: 'machine_app'
		},
		appuser: {
			keyPath: '++id',
			fields: { id: { type: 'id' } },
			fkRelations: {},
			base: 'machine_user'
		},
		appuser_history: {
			keyPath: '++id',
			fields: { id: { type: 'id' } },
			fkRelations: {},
			base: 'machine_user'
		},
		appuser_prefs: {
			keyPath: '++id',
			fields: { id: { type: 'id' } },
			fkRelations: {},
			base: 'machine_user'
		},
		vehicle: {
			keyPath: '++id',
			fields: { id: { type: 'id' } },
			fkRelations: {},
			base: 'machine_data'
		},
		category: {
			keyPath: '++id',
			fields: { id: { type: 'id' } },
			fkRelations: {},
			rights: { ops: ['R', 'L'] }
		}
	};
}

describe('IdaeMetaModelProvider', () => {
	let provider: IdaeMetaModelProvider;
	let model: MachineModel;

	beforeEach(() => {
		provider = new IdaeMetaModelProvider();
		model = makeModel();
	});

	describe('isMetaCollection', () => {
		it('returns true for "appscheme"', () => {
			expect(provider.isMetaCollection('appscheme')).toBe(true);
		});

		it('returns true for "appscheme_" prefix', () => {
			expect(provider.isMetaCollection('appscheme_field')).toBe(true);
			expect(provider.isMetaCollection('appscheme_index')).toBe(true);
		});

		it('returns true for "appuser_" prefix', () => {
			expect(provider.isMetaCollection('appuser_history')).toBe(true);
			expect(provider.isMetaCollection('appuser_prefs')).toBe(true);
			expect(provider.isMetaCollection('appuser_activity')).toBe(true);
		});

		it('returns false for business collections', () => {
			expect(provider.isMetaCollection('vehicle')).toBe(false);
			expect(provider.isMetaCollection('category')).toBe(false);
		});

		it('returns false for "appuser" (no underscore suffix)', () => {
			expect(provider.isMetaCollection('appuser')).toBe(false);
		});

		it('returns false for unrelated names', () => {
			expect(provider.isMetaCollection('reservation')).toBe(false);
			expect(provider.isMetaCollection('')).toBe(false);
		});
	});

	describe('collectionSchema', () => {
		it('throws if not initialized', () => {
			expect(() => provider.collectionSchema('vehicle')).toThrow('not initialized');
		});

		it('returns schema for existing collection', () => {
			provider.initialize(model);
			const schema = provider.collectionSchema('vehicle');
			expect(schema).toBeDefined();
			expect(schema?.keyPath).toBe('++id');
		});

		it('returns undefined for unknown collection', () => {
			provider.initialize(model);
			expect(provider.collectionSchema('nonexistent')).toBeUndefined();
		});

		it('returns schema with rights for category', () => {
			provider.initialize(model);
			const schema = provider.collectionSchema('category');
			expect(schema?.rights).toEqual({ ops: ['R', 'L'] });
		});
	});

	describe('listCollections', () => {
		it('throws if not initialized', () => {
			expect(() => provider.listCollections()).toThrow('not initialized');
		});

		it('returns all collection names from model', () => {
			provider.initialize(model);
			const collections = provider.listCollections();
			expect(collections).toContain('appscheme');
			expect(collections).toContain('vehicle');
			expect(collections).toContain('category');
			expect(collections).toContain('appuser_history');
			expect(collections.length).toBe(7);
		});

		it('returns empty array for empty model', () => {
			provider.initialize({});
			expect(provider.listCollections()).toEqual([]);
		});
	});
});
