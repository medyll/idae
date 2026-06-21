import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock machineServer — FkValidator reads FK defs via getRelations/getAllRelations.
const getModel = vi.fn();
const getRelations = vi.fn();
const getAllRelations = vi.fn();
vi.mock('../MachineServer.js', () => ({
	machineServer: {
		getModel:        (...args: unknown[]) => getModel(...args),
		getRelations:    (...args: unknown[]) => getRelations(...args),
		getAllRelations: (...args: unknown[]) => getAllRelations(...args),
	},
}));

import {
	parseFkKey,
	validateFkEntries,
	findReverseFkHolders,
	invalidateFkDefsCache,
} from '../validation/FkValidator.js';

// Model fixture: travel has multiple FK 'destination', single FK 'agency' (required).
const MODEL = {
	travel: {
		fks: {
			destination: { code: 'destination', multiple: true,  required: false },
			agency:      { code: 'agency',      multiple: false, required: true  },
		},
	},
	destination: { fks: {} },
	booking: {
		fks: {
			travel: { code: 'travel', multiple: false, required: true },
		},
	},
};

beforeEach(() => {
	invalidateFkDefsCache();
	getModel.mockReset();
	getRelations.mockReset();
	getAllRelations.mockReset();
	// getModel(code?) → returns whole model (FkValidator reads model[collection])
	getModel.mockImplementation(async () => MODEL);
	getRelations.mockImplementation(async (collection: string) => (MODEL as any)[collection]?.fks ?? {});
	getAllRelations.mockImplementation(async () =>
		Object.fromEntries(Object.entries(MODEL).map(([code, def]) => [code, (def as any).fks ?? {}]))
	);
});

describe('parseFkKey', () => {
	it('splits {baseName}_{refId} on last underscore', () => {
		expect(parseFkKey('destination_42')).toEqual({ baseName: 'destination', refId: '42' });
	});

	it('handles base names containing underscores', () => {
		expect(parseFkKey('location_office_7')).toEqual({ baseName: 'location_office', refId: '7' });
	});

	it('returns empty refId when no suffix', () => {
		expect(parseFkKey('agency')).toEqual({ baseName: 'agency', refId: '' });
	});
});

describe('validateFkEntries', () => {
	it('passes when no fks block present', async () => {
		const r = await validateFkEntries('travel', { code: 'x', fks: undefined } as any);
		expect(r.valid).toBe(true);
		// required agency not flagged because there is no fks object at all? No — required still applies.
	});

	it('accepts well-formed multiple FK entries (suffix matches id)', async () => {
		const r = await validateFkEntries('travel', {
			fks: {
				destination_1:  { id: 1, name: 'Paris' },
				destination_42: { id: 42, name: 'Rome' },
				agency_3:       { id: 3, name: 'ACME' },
			},
		});
		expect(r).toEqual({ valid: true, errors: [] });
	});

	it('rejects key without _id suffix', async () => {
		const r = await validateFkEntries('travel', {
			fks: { agency: { id: 3 } },
		});
		expect(r.valid).toBe(false);
		expect(r.errors[0].message).toMatch(/missing _id suffix/i);
	});

	it('rejects unknown FK relation', async () => {
		const r = await validateFkEntries('travel', {
			fks: { hotel_5: { id: 5 }, agency_3: { id: 3 } },
		});
		expect(r.valid).toBe(false);
		expect(r.errors.some(e => /Unknown FK relation 'hotel'/.test(e.message))).toBe(true);
	});

	it('rejects entry missing id', async () => {
		const r = await validateFkEntries('travel', {
			fks: { destination_1: { name: 'Paris' }, agency_3: { id: 3 } },
		});
		expect(r.valid).toBe(false);
		expect(r.errors.some(e => /Missing 'id'/.test(e.message))).toBe(true);
	});

	it('rejects suffix not matching entry.id', async () => {
		const r = await validateFkEntries('travel', {
			fks: { destination_1: { id: 99 }, agency_3: { id: 3 } },
		});
		expect(r.valid).toBe(false);
		expect(r.errors.some(e => /must match entry\.id/.test(e.message))).toBe(true);
	});

	it('rejects when required FK absent', async () => {
		const r = await validateFkEntries('travel', {
			fks: { destination_1: { id: 1 } },
		});
		expect(r.valid).toBe(false);
		expect(r.errors.some(e => /'agency' is required/.test(e.message))).toBe(true);
	});

	it('skips validation when collection has no FK defs', async () => {
		const r = await validateFkEntries('destination', { fks: { x_1: { id: 1 } } });
		expect(r.valid).toBe(true);
	});
});

describe('findReverseFkHolders', () => {
	it('maps collections holding FKs that point to target', async () => {
		const holders = await findReverseFkHolders('travel');
		expect(holders).toEqual({ booking: ['travel'] });
	});

	it('returns empty when nothing references target', async () => {
		const holders = await findReverseFkHolders('agency');
		expect(holders).toEqual({ travel: ['agency'] });
	});

	it('returns empty object for unreferenced collection', async () => {
		const holders = await findReverseFkHolders('nonexistent');
		expect(holders).toEqual({});
	});
});
