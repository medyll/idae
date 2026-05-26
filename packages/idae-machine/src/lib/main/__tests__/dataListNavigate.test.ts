import { describe, it, expect, vi } from 'vitest';
import { parseLink } from '../frame/linkParser.js';

// Mirrors the navigate() logic from DataList.svelte — pure, no DOM
function navigate(
	record: Record<string, unknown>,
	link: string,
	collection: string,
	linkCollectionField?: string,
	linkVars?: Record<string, any>
) {
	const parsed = parseLink(link);
	if (!parsed) return null;

	const { action, module, zone } = parsed;
	let navCollection: string;
	let navId: string | undefined;

	if (linkCollectionField) {
		navCollection = String(record[linkCollectionField] ?? '');
		navId = undefined;
	} else {
		navCollection = collection;
		navId = String(record['id'] ?? '');
	}

	return { action, module, zone, navCollection, navId, linkVars };
}

describe('DataList navigate logic', () => {
	describe('linkCollectionField — collection reference mode (e.g. appscheme)', () => {
		it('uses record[linkCollectionField] as collection, no collectionId', () => {
			const result = navigate(
				{ id: 3, code: 'vehicle', name: 'Vehicle' },
				'loadFrame:explorer',
				'appscheme',
				'code'
			);
			expect(result?.navCollection).toBe('vehicle');
			expect(result?.navId).toBeUndefined();
			expect(result?.module).toBe('explorer');
			expect(result?.zone).toBe('main');
		});

		it('uses custom zone from link string', () => {
			const result = navigate(
				{ id: 1, code: 'supplier' },
				'loadFrame:explorer@main.modal',
				'appscheme',
				'code'
			);
			expect(result?.navCollection).toBe('supplier');
			expect(result?.zone).toBe('main.modal');
		});
	});

	describe('no linkCollectionField — data record mode (e.g. vehicle)', () => {
		it('uses DataList collection + record.id', () => {
			const result = navigate(
				{ id: 42, brand: 'Honda', model: 'Civic' },
				'loadFrame:explorer',
				'vehicle'
			);
			expect(result?.navCollection).toBe('vehicle');
			expect(result?.navId).toBe('42');
		});

		it('loadIn action is parsed correctly', () => {
			const result = navigate(
				{ id: 7, brand: 'Ford' },
				'loadIn:card.form@main.panel',
				'vehicle'
			);
			expect(result?.action).toBe('loadIn');
			expect(result?.module).toBe('card.form');
			expect(result?.zone).toBe('main.panel');
			expect(result?.navCollection).toBe('vehicle');
			expect(result?.navId).toBe('7');
		});
	});

	describe('edge cases', () => {
		it('returns null for invalid link', () => {
			expect(navigate({ id: 1 }, 'invalid', 'vehicle')).toBeNull();
		});

		it('handles missing linkCollectionField value gracefully', () => {
			const result = navigate({ id: 1 }, 'loadFrame:explorer', 'appscheme', 'code');
			expect(result?.navCollection).toBe('');
		});
	});
});
