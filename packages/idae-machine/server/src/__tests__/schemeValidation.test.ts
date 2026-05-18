import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
	getSchemeRules,
	validateAgainstScheme,
	invalidateSchemeCache,
} from '../validation/SchemeValidator.js';

// ── Mock dbRouter ─────────────────────────────────────────────────────────────

const HAS_FIELD_VEHICULE = [
	{ gridFks: { appscheme: { code: 'vehicule' }, appscheme_field: { code: 'nomVehicule' } }, required: 1 },
	{ gridFks: { appscheme: { code: 'vehicule' }, appscheme_field: { code: 'prixJour' } },    required: 1 },
	{ gridFks: { appscheme: { code: 'vehicule' }, appscheme_field: { code: 'idVehicule' } },  required: 0 },
	{ gridFks: { appscheme: { code: 'vehicule' }, appscheme_field: { code: 'emailContact' } }, required: 0 },
	{ gridFks: { appscheme: { code: 'vehicule' }, appscheme_field: { code: 'fkCategorie' } },  required: 0 },
];

const FIELD_DOCS = [
	{ code: 'nomVehicule',  gridFks: { appscheme_field_type: { code: 'text' } } },
	{ code: 'prixJour',     gridFks: { appscheme_field_type: { code: 'number' } } },
	{ code: 'idVehicule',   gridFks: { appscheme_field_type: { code: 'id' } } },
	{ code: 'emailContact', gridFks: { appscheme_field_type: { code: 'email' } } },
	{ code: 'fkCategorie',  gridFks: { appscheme_field_type: { code: 'fk-categorie.id' } } },
];

let callCount = 0;

vi.mock('../middleware/dbRouter.js', () => ({
	getConn: vi.fn().mockImplementation(() => {
		callCount++;
		return Promise.resolve({
			collection: (name: string) => ({
				find: (query: any) => ({
					toArray: async () => {
						if (name === 'appscheme_has_field') {
							const code = query['gridFks.appscheme.code'];
							if (code === 'vehicule') return HAS_FIELD_VEHICULE;
							return [];
						}
						if (name === 'appscheme_field') return FIELD_DOCS;
						return [];
					},
				}),
			}),
		});
	}),
}));

vi.mock('../config.js', () => ({ config: { org: 'test' } }));

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('getSchemeRules', () => {
	beforeEach(() => {
		invalidateSchemeCache();
		callCount = 0;
	});

	it('builds FieldRule map from appscheme_has_field + appscheme_field', async () => {
		const rules = await getSchemeRules('vehicule');
		expect(rules.nomVehicule).toEqual({ required: true,  type: 'text' });
		expect(rules.prixJour).toEqual(   { required: true,  type: 'number' });
		expect(rules.idVehicule).toEqual(  { required: false });
		expect(rules.emailContact).toEqual({ required: false, type: 'email' });
	});

	it('skips fk-* fields (no type set)', async () => {
		const rules = await getSchemeRules('vehicule');
		expect(rules.fkCategorie).toEqual({ required: false });
		expect(rules.fkCategorie?.type).toBeUndefined();
	});

	it('caches result — getConn called once on double fetch', async () => {
		await getSchemeRules('vehicule');
		await getSchemeRules('vehicule');
		expect(callCount).toBe(1);
	});

	it('returns {} for unknown collection (graceful skip)', async () => {
		const rules = await getSchemeRules('nonexistent');
		expect(rules).toEqual({});
	});

	it('invalidateSchemeCache() clears specific collection', async () => {
		await getSchemeRules('vehicule');
		invalidateSchemeCache('vehicule');
		await getSchemeRules('vehicule');
		expect(callCount).toBe(2);
	});

	it('invalidateSchemeCache() with no arg clears all', async () => {
		await getSchemeRules('vehicule');
		invalidateSchemeCache();
		await getSchemeRules('vehicule');
		expect(callCount).toBe(2);
	});
});

describe('mapType (via getSchemeRules)', () => {
	beforeEach(() => invalidateSchemeCache());

	it('text-area → text type', async () => {
		vi.mocked((await import('../middleware/dbRouter.js')).getConn).mockResolvedValueOnce({
			collection: (name: string) => ({
				find: (_: any) => ({
					toArray: async () => {
						if (name === 'appscheme_has_field') return [
							{ gridFks: { appscheme: { code: 'x' }, appscheme_field: { code: 'bio' } }, required: 0 },
						];
						return [{ code: 'bio', gridFks: { appscheme_field_type: { code: 'text-area' } } }];
					},
				}),
			}),
		} as any);
		const rules = await getSchemeRules('x');
		expect(rules.bio?.type).toBe('text');
	});

	it('id → no type (skipped)', async () => {
		const rules = await getSchemeRules('vehicule');
		expect(rules.idVehicule?.type).toBeUndefined();
	});
});

describe('validateAgainstScheme', () => {
	beforeEach(() => invalidateSchemeCache());

	it('required field missing → invalid with correct message', async () => {
		const result = await validateAgainstScheme('vehicule', { prixJour: 50 });
		expect(result.valid).toBe(false);
		expect(result.errors.nomVehicule).toBe('Ce champ est obligatoire');
	});

	it('type violation → invalid with correct message', async () => {
		const result = await validateAgainstScheme('vehicule', {
			nomVehicule: 'Peugeot 308',
			prixJour:    'pas-un-nombre',
		});
		expect(result.valid).toBe(false);
		expect(result.errors.prixJour).toBe('Doit être un nombre');
	});

	it('valid record → valid', async () => {
		const result = await validateAgainstScheme('vehicule', {
			nomVehicule: 'Peugeot 308',
			prixJour:    50,
		});
		expect(result.valid).toBe(true);
		expect(result.errors).toEqual({});
	});

	it('unknown collection → valid (graceful skip)', async () => {
		const result = await validateAgainstScheme('ghost_collection', {});
		expect(result.valid).toBe(true);
	});

	it('bad email format → invalid', async () => {
		const result = await validateAgainstScheme('vehicule', {
			nomVehicule:  'Peugeot',
			prixJour:     50,
			emailContact: 'not-an-email',
		});
		expect(result.valid).toBe(false);
		expect(result.errors.emailContact).toBe('Format email invalide');
	});

	it('valid email → no error on email field', async () => {
		const result = await validateAgainstScheme('vehicule', {
			nomVehicule:  'Peugeot',
			prixJour:     50,
			emailContact: 'test@example.com',
		});
		expect(result.valid).toBe(true);
	});
});
