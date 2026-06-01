import { describe, it, expect, beforeEach, vi } from 'vitest';
import { buildLoadInUrl } from '../machine.js';

describe('buildLoadInUrl', () => {
	it('builds URL with targetId, modulePath, and collection', () => {
		const url = buildLoadInUrl('explorer.list', 'main', 'vehicle');
		expect(url).toBe('/+main/explorer.list/vehicle');
	});

	it('builds URL with collectionId', () => {
		const url = buildLoadInUrl('card.edit', 'main.modal', 'vehicle', '42');
		expect(url).toBe('/+main.modal/card.edit/vehicle/42');
	});

	it('builds URL with vars query string', () => {
		const url = buildLoadInUrl('card.edit', 'main.modal', 'vehicle', '42', 'tab=info');
		expect(url).toBe('/+main.modal/card.edit/vehicle/42?tab=info');
	});

	it('builds URL without collectionId but with vars', () => {
		const url = buildLoadInUrl('explorer.list', 'main', 'vehicle', undefined, 'sort=name');
		expect(url).toBe('/+main/explorer.list/vehicle?sort=name');
	});

	it('handles empty vars gracefully', () => {
		const url = buildLoadInUrl('explorer.list', 'main', 'vehicle', undefined, '');
		expect(url).toBe('/+main/explorer.list/vehicle');
	});

	it('is a pure function — no side effects', () => {
		const url1 = buildLoadInUrl('a', 'b', 'c');
		const url2 = buildLoadInUrl('a', 'b', 'c');
		expect(url1).toBe(url2);
	});
});
