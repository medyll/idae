import { describe, it, expect } from 'vitest';
import { parseLoadInUrl } from '../router/urlParser.js';

describe('parseLoadInUrl', () => {
	it('parses single target without id', () => {
		const result = parseLoadInUrl('/+main/explorer.list/vehicle');
		expect(result).toEqual([
			{ targetId: 'main', modulePath: 'explorer.list', collection: 'vehicle' }
		]);
	});

	it('parses single target with collectionId', () => {
		const result = parseLoadInUrl('/+main/explorer.split/vehicle/42');
		expect(result).toEqual([
			{ targetId: 'main', modulePath: 'explorer.split', collection: 'vehicle', collectionId: '42' }
		]);
	});

	it('parses single target with vars', () => {
		const result = parseLoadInUrl('/+main/card.edit/vehicle/42?tab=info&mode=dark');
		expect(result).toEqual([
			{
				targetId: 'main',
				modulePath: 'card.edit',
				collection: 'vehicle',
				collectionId: '42',
				vars: { tab: 'info', mode: 'dark' }
			}
		]);
	});

	it('parses multi-target URL', () => {
		const result = parseLoadInUrl('/+main/explorer.split/vehicle/42/+main.modal/card.edit/vehicle/42');
		expect(result).toHaveLength(2);
		expect(result[0]).toEqual({
			targetId: 'main',
			modulePath: 'explorer.split',
			collection: 'vehicle',
			collectionId: '42'
		});
		expect(result[1]).toEqual({
			targetId: 'main.modal',
			modulePath: 'card.edit',
			collection: 'vehicle',
			collectionId: '42'
		});
	});

	it('parses multi-target with vars on last segment only', () => {
		const result = parseLoadInUrl('/+main/explorer.list/vehicle/+main.modal/card.edit/vehicle/42?tab=info');
		expect(result).toHaveLength(2);
		expect(result[0].vars).toBeUndefined();
		expect(result[1].vars).toEqual({ tab: 'info' });
	});

	it('returns empty array for URL without + prefix', () => {
		expect(parseLoadInUrl('/app/vehicle')).toEqual([]);
		expect(parseLoadInUrl('/')).toEqual([]);
		expect(parseLoadInUrl('')).toEqual([]);
	});

	it('handles complex dotted targetId and modulePath', () => {
		const result = parseLoadInUrl('/+main.window/card.view/vehicle/99');
		expect(result[0].targetId).toBe('main.window');
		expect(result[0].modulePath).toBe('card.view');
	});

	it('decodes URI components in vars', () => {
		const result = parseLoadInUrl('/+main/explorer.list/vehicle?filter=name%20eq%20foo');
		expect(result[0].vars).toEqual({ filter: 'name eq foo' });
	});
});
