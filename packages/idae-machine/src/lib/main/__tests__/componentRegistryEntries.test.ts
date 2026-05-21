import { describe, it, expect } from 'vitest';
import { componentRegistry } from '../router/componentRegistry.js';

describe('Global componentRegistry entries (S25)', () => {
	it('has "explorer" registered', () => {
		expect(componentRegistry.has('explorer')).toBe(true);
	});

	it('has "explorer.collections" registered', () => {
		expect(componentRegistry.has('explorer.collections')).toBe(true);
	});

	it('has card.* entries registered', () => {
		expect(componentRegistry.has('card.form')).toBe(true);
		expect(componentRegistry.has('card.create')).toBe(true);
		expect(componentRegistry.has('card.edit')).toBe(true);
		expect(componentRegistry.has('card.picker')).toBe(true);
	});

	it('does NOT have old explorer.* entries (list/table/actions/card)', () => {
		expect(componentRegistry.has('explorer.list')).toBe(false);
		expect(componentRegistry.has('explorer.table')).toBe(false);
		expect(componentRegistry.has('explorer.actions')).toBe(false);
		expect(componentRegistry.has('explorer.card')).toBe(false);
	});

	it('has exactly 6 entries', () => {
		const keys = componentRegistry.keys();
		expect(keys).toHaveLength(6);
		expect(keys.sort()).toEqual([
			'card.create',
			'card.edit',
			'card.form',
			'card.picker',
			'explorer',
			'explorer.collections',
		]);
	});
});
