import { describe, it, expect } from 'vitest';
import { IDbCollectionFieldForge } from '../main/machineDb.js';

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

describe('IDbCollectionFieldForge', () => {
  const forge = new IDbCollectionFieldForge('agent', 'name', agentData);

  it('format returns formatted value', () => {
    expect(forge.format).toBe('Test Agent');
  });

  it('inputDataSet returns correct data-* attributes', () => {
    const attrs = forge.inputDataSet;
    expect(attrs['data-collection']).toBe('agent');
    expect(attrs['data-fieldName']).toBe('name');
  });

  it('forge returns IDbForge for field', () => {
    const f = forge.forge;
    expect(f).toBeDefined();
    expect(f?.fieldType).toContain('text');
  });

  it('fieldArgs returns field arguments', () => {
    // fieldArgs peut être un tableau ou undefined
    if (forge.fieldArgs) {
      expect(forge.fieldArgs).toContain('private');
    } else {
      expect(forge.fieldArgs).toBeUndefined();
    }
  });

  it('fieldType returns field type', () => {
    expect(forge.fieldType).toContain('text');
  });

  it('htmlInputType returns correct input type', () => {
    expect(['text', 'area']).toContain(forge.htmlInputType);
  });

  it('rawData returns the original data', () => {
    expect(forge.rawData).toBe(agentData);
  });

  it('iterateArray returns array (empty for non-array)', () => {
    expect(Array.isArray(forge.iterateArray('name', ['a', 'b']))).toBe(true);
  });

  it('iterateObject returns array (empty for non-object)', () => {
    expect(Array.isArray(forge.iterateObject('name', { a: 1 }))).toBe(true);
  });
});
