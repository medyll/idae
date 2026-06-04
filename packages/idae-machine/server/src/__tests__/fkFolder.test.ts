import { describe, it, expect, vi } from 'vitest';
import { foldFks, type FkResolver } from '../validation/FkFolder.js';
import type { MachineModel } from '../../../src/lib/types/machine-model.js';

const travelModel: MachineModel = {
	travel: {
		keyPath: '++id',
		fields:  {},
		fks: {
			destination: { code: 'destination', multiple: true,  required: false },
			agency:      { code: 'agency',      multiple: false, required: true  },
		},
	},
};

const parisRecord  = { id: 1,  code: '1',  name: 'Paris' };
const romeRecord   = { id: 42, code: '42', name: 'Rome'  };
const acmeRecord   = { id: 3,  code: '3',  name: 'ACME'  };

function makeResolver(map: Record<string, Record<number, Record<string, unknown>>>): FkResolver {
	return async (col, id) => map[col]?.[Number(id)] ?? null;
}

describe('foldFks', () => {
	it('builds fks.{name}_{id} entry from scalar', async () => {
		const resolver = makeResolver({ agency: { 3: acmeRecord } });
		const { data, errors } = await foldFks(
			travelModel, 'travel',
			{ agency: 3 },
			resolver,
		);
		expect(errors).toEqual([]);
		expect((data.fks as any).agency_3).toMatchObject({ id: 3, name: 'ACME' });
	});

	it('builds multiple entries from array scalar', async () => {
		const resolver = makeResolver({
			destination: { 1: parisRecord, 42: romeRecord },
			agency:      { 3: acmeRecord },
		});
		const { data, errors } = await foldFks(
			travelModel, 'travel',
			{ destination: [1, 42], agency: 3 },
			resolver,
		);
		expect(errors).toEqual([]);
		const fks = data.fks as Record<string, unknown>;
		expect(fks['destination_1']).toMatchObject({ name: 'Paris' });
		expect(fks['destination_42']).toMatchObject({ name: 'Rome' });
	});

	it('error when required FK absent', async () => {
		const resolver = makeResolver({ agency: { 3: acmeRecord } });
		const { errors } = await foldFks(
			travelModel, 'travel',
			{},  // no agency
			resolver,
		);
		expect(errors.some(e => e.fkName === 'agency')).toBe(true);
	});

	it('no error when optional FK absent', async () => {
		const resolver = makeResolver({ agency: { 3: acmeRecord } });
		const { errors } = await foldFks(
			travelModel, 'travel',
			{ agency: 3 },  // destination absent — optional
			resolver,
		);
		expect(errors).toEqual([]);
	});

	it('error when target not found in resolver', async () => {
		const resolver = makeResolver({ agency: {} });  // empty — not found
		const { errors } = await foldFks(
			travelModel, 'travel',
			{ agency: 99 },
			resolver,
		);
		expect(errors.some(e => e.fkName === 'agency' && e.message.includes('99'))).toBe(true);
	});

	it('preserves existing fks entries not touched by fold', async () => {
		const resolver = makeResolver({ agency: { 3: acmeRecord } });
		const { data, errors } = await foldFks(
			travelModel, 'travel',
			{ agency: 3, fks: { legacy_key: { id: 99 } } },
			resolver,
		);
		expect(errors).toEqual([]);
		expect((data.fks as any).legacy_key).toMatchObject({ id: 99 });
		expect((data.fks as any).agency_3).toMatchObject({ id: 3 });
	});

	it('returns data unchanged for unknown collection', async () => {
		const resolver = vi.fn();
		const payload = { foo: 'bar' };
		const { data, errors } = await foldFks(travelModel, 'unknown', payload, resolver as FkResolver);
		expect(data).toBe(payload);
		expect(errors).toEqual([]);
		expect(resolver).not.toHaveBeenCalled();
	});

	it('returns data unchanged for collection with no fks', async () => {
		const model: MachineModel = { category: { keyPath: '++id', fields: {}, fks: {} } };
		const resolver = vi.fn();
		const payload = { name: 'Sedan' };
		const { data, errors } = await foldFks(model, 'category', payload, resolver as FkResolver);
		expect(data).toBe(payload);
		expect(errors).toEqual([]);
		expect(resolver).not.toHaveBeenCalled();
	});

	it('uses target.id as key suffix when present', async () => {
		const resolver = makeResolver({ agency: { 7: { id: 7, code: '7', name: 'X' } } });
		const { data } = await foldFks(travelModel, 'travel', { agency: 7 }, resolver);
		expect((data.fks as any)['agency_7']).toBeDefined();
	});
});
