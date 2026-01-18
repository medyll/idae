import { describe, it, expect } from 'vitest';
import { IDbCollection } from './IDbCollection';
import { MachineDb } from '../machineDb';
import { IDbCollectionValues } from './IDbCollectionValues';
import { IDbCollectionFieldForge } from './IDbCollectionFieldForge';
import { IDbFormValidate } from './IDbFormValidate';

// Mocks
const mockTemplate = {
  fields: { name: { type: 'string' } },
  presentation: 'Test Presentation',
  fks: ['fk1'],
  index: 'idx_test',
};
const mockModel = { template: mockTemplate };
const mockIdbqModel = { agents: mockModel };
const mockDb = {} as MachineDb;

describe('IDbCollection', () => {
  const collectionName = 'agents';
  const collection = new IDbCollection(collectionName, mockDb, mockIdbqModel);

  it('should instantiate with correct properties', () => {
    expect(collection.collection).toBe(collectionName);
    expect(collection.model).toBe(mockModel);
    expect(collection.fields).toEqual(mockTemplate.fields);
  });

  it('should get presentation', () => {
    expect(collection.getPresentation()).toBe('Test Presentation');
  });

  it('should get field rule', () => {
    expect(collection.getFieldRule('name')).toEqual({ type: 'string' });
  });

  it('should get template', () => {
    expect(collection.getTemplate()).toBe(mockTemplate);
  });

  it('should get model template fks', () => {
    expect(collection.getModelTemplateFks()).toEqual(['fk1']);
  });

  it('should get index name', () => {
    expect(collection.getIndexName()).toBe('idx_test');
  });

  it('should create IDbCollectionValues instance', () => {
    const values = collection.collectionValues();
    expect(values).toBeInstanceOf(IDbCollectionValues);
  });

  it('should create IDbCollectionFieldForge instance', () => {
    const forge = collection.fieldForge('name', { name: 'value' });
    expect(forge).toBeInstanceOf(IDbCollectionFieldForge);
  });

  it('should create IDbFormValidate instance', () => {
    const validate = collection.getFormValidate();
    expect(validate).toBeInstanceOf(IDbFormValidate);
  });
});
