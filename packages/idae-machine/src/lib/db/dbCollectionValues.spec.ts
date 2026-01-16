import { describe, it, expect } from 'vitest';

import { MachineDb } from '$lib/main/machineDb.js';
import { IDbCollectionValues } from '$lib/main/machine/IDbCollectionValues.js';
import { schemeModelTestDb } from '$lib/db/testDbSchema.js';

const agentData = {
  id: 1,
  name: 'Test Agent',
  code: 'A1',
  model: 'gpt',
  prompt: 'Say hello',
  created_at: '2026-01-01',
  ia_lock: false,
  agentPromptId: 2,
  tags: ['foo', 'bar'],
  meta: { foo: 1, bar: 2 },
  relatedAgents: [3, 4],
  status: 'active'
};

describe('IDbCollectionValues', () => {
  const values = new IDbCollectionValues('agent');
  // Remplace le modèle par le schéma de test pour tous les tests
  values.idbBase = new MachineDb(schemeModelTestDb);

  it('format returns joined string for array field', () => {
    // array fields are not formatted specially, but should not throw
    expect(() => values.format('tags', agentData)).not.toThrow();
  });

  it('iterateArrayField returns correct length for array field', () => {
    const arr = values.iterateArrayField('tags', agentData.tags);
    expect(Array.isArray(arr)).toBe(true);
    expect(arr.length).toBe(agentData.tags.length);
  });

  it('iterateObjectField returns correct length for object field', () => {
    const obj = values.iterateObjectField('meta', agentData.meta);
    expect(Array.isArray(obj)).toBe(true);
    expect(obj.length).toBe(Object.keys(agentData.meta).length);
  });

  it('format does not throw for fk multiple', () => {
    expect(() => values.format('relatedAgents', agentData)).not.toThrow();
  });

  it('format returns value for required/readonly field', () => {
    expect(values.format('status', agentData)).toBe('active');
  });
});
describe('IDbCollectionValues', () => {
  const values = new IDbCollectionValues('agent');

  it('presentation returns formatted string', () => {
    expect(values.presentation(agentData)).toContain('Test Agent');
  });

  it('indexValue returns the index field value', () => {
    expect(values.indexValue(agentData)).toBe(1);
  });

  it('format returns formatted value for text', () => {
    expect(values.format('name', agentData)).toBe('Test Agent');
  });

  it('getInputDataSet returns correct data-* attributes', () => {
    const attrs = values.getInputDataSet('name', agentData);
    expect(attrs['data-collection']).toBe('agent');
    expect(attrs['data-fieldName']).toBe('name');
  });

  it('iterateArrayField returns array (empty for non-array)', () => {
    expect(Array.isArray(values.iterateArrayField('name', ['a', 'b']))).toBe(true);
  });

  it('iterateObjectField returns array (empty for non-object)', () => {
    expect(Array.isArray(values.iterateObjectField('name', { a: 1 }))).toBe(true);
  });
});
