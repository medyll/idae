
import { describe, it, expect } from 'vitest';

import { MachineDb } from './machineDb.js';
import { schemeModelTestDb } from '../demo/testDbSchema.js';

describe('IDbBase', () => {
  const dbCollections = new MachineDb(schemeModelTestDb);

  

  it('fks returns the parsed fks collections', () => {
    const fks = dbCollections.fks('agent');
    expect(fks).toBeDefined();
    expect(Object.keys(fks)).toContain('agentPrompt');
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
