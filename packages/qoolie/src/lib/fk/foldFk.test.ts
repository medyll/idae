import { describe, it, expect, vi } from 'vitest';
import { foldFk, type FkDef, type FkResolver } from './foldFk.js';

const travelFks: Record<string, FkDef> = {
  destination: { code: 'destination', multiple: true, required: false },
  agency: { code: 'agency', multiple: false, required: true },
};

function makeResolver(map: Record<string, Record<string, Record<string, unknown>>>): FkResolver {
  return async (col, _indexField, value) => map[col]?.[String(value)] ?? null;
}

describe('foldFk', () => {
  it('single FK → fks.<name>, no id suffix', async () => {
    const resolver = makeResolver({ agency: { '3': { id: 3, name: 'ACME' } } });
    const { data, errors } = await foldFk(travelFks, { agency: 3 }, resolver);
    expect(errors).toEqual([]);
    expect((data.fks as any).agency).toMatchObject({ id: 3, name: 'ACME' });
  });

  it('multiple FK (legacy) → fks.<name>_<id> per entry', async () => {
    const resolver = makeResolver({
      destination: { '1': { id: 1, name: 'Paris' }, '42': { id: 42, name: 'Rome' } },
      agency: { '3': { id: 3, name: 'ACME' } },
    });
    const { data, errors } = await foldFk(travelFks, { destination: [42, 1], agency: 3 }, resolver);
    expect(errors).toEqual([]);
    const fks = data.fks as Record<string, any>;
    expect(fks['destination_1']).toMatchObject({ name: 'Paris' });
    expect(fks['destination_42']).toMatchObject({ name: 'Rome' });
  });

  it('strips _id and nested fks from snapshot', async () => {
    const richTarget = { id: 3, name: 'ACME', _id: 'mongo_oid', fks: { sub: { id: 1 } } };
    const resolver = makeResolver({ agency: { '3': richTarget } });
    const { data } = await foldFk(travelFks, { agency: 3 }, resolver);
    const snap = (data.fks as any).agency;
    expect(snap._id).toBeUndefined();
    expect(snap.fks).toBeUndefined();
    expect(snap.name).toBe('ACME');
  });

  it('required FK missing → error', async () => {
    const resolver = makeResolver({});
    const { errors } = await foldFk(travelFks, {}, resolver);
    expect(errors.some((e) => e.fkName === 'agency')).toBe(true);
  });

  it('optional FK missing → no error', async () => {
    const resolver = makeResolver({ agency: { '3': { id: 3 } } });
    const { errors } = await foldFk(travelFks, { agency: 3 }, resolver);
    expect(errors).toEqual([]);
  });

  it('target not found → error mentions the id', async () => {
    const resolver = makeResolver({});
    const { errors } = await foldFk(travelFks, { agency: 99 }, resolver);
    expect(errors.some((e) => e.fkName === 'agency' && e.message.includes('99'))).toBe(true);
  });

  it('preserves existing fks entries not touched by fold', async () => {
    const resolver = makeResolver({ agency: { '3': { id: 3 } } });
    const { data } = await foldFk(travelFks, { agency: 3, fks: { legacy_key: { id: 99 } } }, resolver);
    expect((data.fks as any).legacy_key).toMatchObject({ id: 99 });
    expect((data.fks as any).agency).toMatchObject({ id: 3 });
  });

  it('no fk defs → returns record unchanged, resolver never called', async () => {
    const resolver = vi.fn();
    const payload = { foo: 'bar' };
    const { data, errors } = await foldFk({}, payload, resolver as FkResolver);
    expect(data).toBe(payload);
    expect(errors).toEqual([]);
    expect(resolver).not.toHaveBeenCalled();
  });

  it('custom indexField is forwarded to the resolver', async () => {
    const resolver = vi.fn(async () => ({ id: 3 }));
    await foldFk({ agency: { code: 'agency' } }, { agency: 3 }, resolver, 'slug');
    expect(resolver).toHaveBeenCalledWith('agency', 'slug', 3);
  });
});
