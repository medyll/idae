
import { describe, it, expect } from 'vitest';

import { IDbBase } from './machineDb.js';
import { schemeModelTestDb } from '../db/testDbSchema.js';

describe('IDbBase', () => {
  const dbCollections = new IDbBase(schemeModelTestDb);

  

  it('getFkFieldType returns the fk field type', () => {
    const fkType = dbCollections.getFkFieldType('agentPrompt.id');
    expect(fkType).toBe('id (readonly)');
  });

  it('getFkTemplateFields returns the fk template fields', () => {
    const fkFields = dbCollections.getFkTemplateFields('agentPrompt.id');
    expect(fkFields).toBeDefined();
    expect(fkFields.name).toBeDefined();
  });

  it('testIs detects primitive type', () => {
    const res = dbCollections['testIs']('primitive', 'text');
    expect(res).toBeDefined();
    expect(res?.is).toBe('primitive');
  });

  it('is returns extract result for primitive', () => {
    const res = dbCollections.is('primitive', 'text');
    expect(res).toBeDefined();
    expect(res.is).toBe('primitive');
  });

  it('indexValue returns the value for index field', () => {
    const val = dbCollections.indexValue('agent', { id: 42, name: 'bob', model: 'x' });
    expect(val).toBe(42);
  });

  it('extract returns correct structure for primitive', () => {
    const res = dbCollections.extract('primitive', 'text');
    expect(res).toBeDefined();
    expect(res.is).toBe('primitive');
    expect(res.fieldType).toBe('text');
  });

  it('fks returns the parsed fks collections', () => {
    const fks = dbCollections.fks('agent');
    expect(fks).toBeDefined();
    expect(Object.keys(fks)).toContain('agentPrompt');
  });

  it('iterateArrayField returns array of IDbForge for array type', () => {
    // Ajout d'un champ array dans le schéma de test si besoin
    const arr = dbCollections.iterateArrayField('agent', 'agentPromptId', [1, 2]);
    expect(Array.isArray(arr)).toBe(true);
  });

  it('iterateObjectField returns array of IDbForge for object type', () => {
    // Ajout d'un champ object dans le schéma de test si besoin
    const obj = dbCollections.iterateObjectField('agentPrompt', 'id', { a: 1, b: 2 });
    expect(Array.isArray(obj)).toBe(true);
  });


  it('parseRawCollection returns all fields for a collection', () => {
    const agentFields = dbCollections.parseRawCollection('agent');
    expect(agentFields).toBeDefined();
    expect(agentFields?.id).toBeDefined();
    expect(agentFields?.name).toBeDefined();
    expect(agentFields?.code).toBeDefined();
  });

  it('parseCollectionFieldName returns correct IDbForge for primitive', () => {
    const field = dbCollections.parseCollectionFieldName('agent', 'name');
    expect(field).toBeDefined();
    expect(field?.fieldType).toContain('text');
    expect(field?.is).toBe('primitive');
  });

  it('parseCollectionFieldName returns correct IDbForge for fk', () => {
    const field = dbCollections.parseCollectionFieldName('agent', 'agentPromptId');
    expect(field).toBeDefined();
    expect(typeof field?.fieldType).toBe('string');
    expect(field?.fieldType).toContain('fk-agentPrompt.id');
  });

  it('reverseFks returns referencing collections', () => {
    const rev = dbCollections.reverseFks('agentPrompt');
    expect(rev).toBeDefined();
    expect(Object.keys(rev)).toContain('agent');
  });
});
