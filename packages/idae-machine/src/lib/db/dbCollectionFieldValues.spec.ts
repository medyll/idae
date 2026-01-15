import { describe, it, expect } from 'vitest';
import { IDbCollectionFieldValues } from '../main/machineDb.js';

const agentData = {
  id: 1,
  name: 'Test Agent',
  code: 'A1',
  model: 'gpt',
  prompt: 'Say hello',
  created_at: '2026-01-01',
  ia_lock: false,
  agentPromptId: 2
};

describe('IDbCollectionFieldValues', () => {
  const fieldValues = new IDbCollectionFieldValues('agent', agentData);

  it('format returns formatted value for primitive', () => {
    expect(fieldValues.format('name')).toBe('Test Agent');
  });

  it('getInputDataSet returns correct data-* attributes', () => {
    const attrs = fieldValues.getInputDataSet('name');
    expect(attrs['data-collection']).toBe('agent');
    expect(attrs['data-fieldName']).toBe('name');
  });

  it('getForge returns IDbForge for field', () => {
    const forge = fieldValues.getForge('name');
    expect(forge).toBeDefined();
    expect(forge?.fieldType).toContain('text');
  });

  it('iterateArray returns array (empty for non-array)', () => {
    expect(Array.isArray(fieldValues.iterateArray('name', ['a', 'b']))).toBe(true);
  });

  it('iterateObject returns array (empty for non-object)', () => {
    expect(Array.isArray(fieldValues.iterateObject('name', { a: 1 }))).toBe(true);
  });
});
