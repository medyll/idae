import { describe, it, expect } from 'vitest';
import { componentRegistry } from '../router/componentRegistry.js';

describe('Global componentRegistry entries', () => {
	it('has "explorer" registered', () => {
		expect(componentRegistry.has('explorer')).toBe(true);
	});

	it('does NOT have "explorer.collections" (removed — CollectionNav handles sidebar nav)', () => {
		expect(componentRegistry.has('explorer.collections')).toBe(false);
	});

	it('has "card.form" registered pointing to DataForm', () => {
		expect(componentRegistry.has('card.form')).toBe(true);
	});

	it('does NOT have removed aliases', () => {
		expect(componentRegistry.has('card.create')).toBe(false);
		expect(componentRegistry.has('card.edit')).toBe(false);
		expect(componentRegistry.has('card.picker')).toBe(false);
	});

	it('does NOT have old explorer.* entries', () => {
		expect(componentRegistry.has('explorer.list')).toBe(false);
		expect(componentRegistry.has('explorer.table')).toBe(false);
		expect(componentRegistry.has('explorer.actions')).toBe(false);
		expect(componentRegistry.has('explorer.card')).toBe(false);
	});

	it('has "rbac.matrix" registered', () => {
		expect(componentRegistry.has('rbac.matrix')).toBe(true);
	});

	it('has "fullinfo" registered', () => {
		expect(componentRegistry.has('fullinfo')).toBe(true);
	});

	it('has exactly 4 entries', () => {
		const keys = componentRegistry.keys();
		expect(keys).toHaveLength(4);
		expect(keys.sort()).toEqual([
			'card.form',
			'explorer',
			'fullinfo',
			'rbac.matrix',
		]);
	});
});
