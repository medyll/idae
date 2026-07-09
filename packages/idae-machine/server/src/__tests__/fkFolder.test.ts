import { describe, it, expect, vi } from 'vitest';
import { foldFks, type FkResolver } from '../validation/FkFolder.js';
import type { MachineFkDef } from '../../../src/lib/types/machine-model.js';

// FK is always single (UNMULTIPLE.md) — MachineFkDef has no `multiple` field.
// The generic array-scalar fold path is qoolie's own (foldFk.test.ts), not idae's.
const travelFks: Record<string, MachineFkDef> = {
	destination: { code: 'destination', required: false },
	agency:      { code: 'agency',      required: true  },
};

const acmeRecord = { id: 3, code: '3', name: 'ACME' };

function makeResolver(map: Record<string, Record<number, Record<string, unknown>>>): FkResolver {
	return async (col, id) => map[col]?.[Number(id)] ?? null;
}

describe('foldFks', () => {
	it('builds flat fks.{name} snapshot from scalar (single FK — no id suffix)', async () => {
		const resolver = makeResolver({ agency: { 3: acmeRecord } });
		const { data, errors } = await foldFks(
			travelFks,
			{ agency: 3 },
			resolver,
		);
		expect(errors).toEqual([]);
		expect((data.fks as any).agency).toMatchObject({ id: 3, name: 'ACME' });
	});

	it('strips _id and nested fks from embedded snapshot', async () => {
		const richTarget = { id: 3, name: 'ACME', _id: 'mongo_oid', fks: { sub_1: { id: 1 } } };
		const resolver = makeResolver({ agency: { 3: richTarget as any } });
		const { data } = await foldFks(travelFks, { agency: 3 }, resolver);
		const snap = (data.fks as any).agency;
		expect(snap._id).toBeUndefined();
		expect(snap.fks).toBeUndefined();
		expect(snap.name).toBe('ACME');
	});

	it('error when required FK absent', async () => {
		const resolver = makeResolver({ agency: { 3: acmeRecord } });
		const { errors } = await foldFks(
			travelFks,
			{},  // no agency
			resolver,
		);
		expect(errors.some(e => e.fkName === 'agency')).toBe(true);
	});

	it('no error when optional FK absent', async () => {
		const resolver = makeResolver({ agency: { 3: acmeRecord } });
		const { errors } = await foldFks(
			travelFks,
			{ agency: 3 },  // destination absent — optional
			resolver,
		);
		expect(errors).toEqual([]);
	});

	it('error when target not found in resolver', async () => {
		const resolver = makeResolver({ agency: {} });  // empty — not found
		const { errors } = await foldFks(
			travelFks,
			{ agency: 99 },
			resolver,
		);
		expect(errors.some(e => e.fkName === 'agency' && e.message.includes('99'))).toBe(true);
	});

	it('preserves existing fks entries not touched by fold', async () => {
		const resolver = makeResolver({ agency: { 3: acmeRecord } });
		const { data, errors } = await foldFks(
			travelFks,
			{ agency: 3, fks: { legacy_key: { id: 99 } } },
			resolver,
		);
		expect(errors).toEqual([]);
		expect((data.fks as any).legacy_key).toMatchObject({ id: 99 });
		expect((data.fks as any).agency).toMatchObject({ id: 3 });
	});

	it('returns data unchanged when no fk defs', async () => {
		const resolver = vi.fn();
		const payload = { foo: 'bar' };
		const { data, errors } = await foldFks({}, payload, resolver as FkResolver);
		expect(data).toBe(payload);
		expect(errors).toEqual([]);
		expect(resolver).not.toHaveBeenCalled();
	});

	it('single FK snapshot keyed by field name regardless of target id', async () => {
		const resolver = makeResolver({ agency: { 7: { id: 7, code: '7', name: 'X' } } });
		const { data } = await foldFks(travelFks, { agency: 7 }, resolver);
		expect((data.fks as any)['agency']).toBeDefined();
		expect((data.fks as any)['agency']).toMatchObject({ id: 7 });
	});
});
