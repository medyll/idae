import { describe, it, expect } from 'vitest';
import { IDbCollectionFieldForge } from './IDbCollectionFieldForge';
import { IDbCollectionValues } from './IDbCollectionValues';

// Mocks
const mockCollection = 'agents';
const mockFieldName = 'name';
const mockData = { name: 'John Doe' };

const mockCollectionValues = {
  format: (field, data) => `formatted:${data[field]}`,
  getInputDataSet: (field, data) => ({ field, value: data[field] }),
  idbBase: {
    parseCollectionFieldName: (collection, field) => ({
      fieldArgs: { required: true },
      fieldType: 'text',
    }),
  },
  iterateArrayField: (field, data) => [{ fieldArgs: {}, fieldType: 'text' }],
  iterateObjectField: (field, data) => [{ fieldArgs: {}, fieldType: 'text' }],
};

describe('IDbCollectionFieldForge', () => {
  const forge = new IDbCollectionFieldForge(
    mockCollection,
    mockFieldName,
    mockData,
    mockCollectionValues as any
  );

  it('should format field value', () => {
    expect(forge.format).toBe('formatted:John Doe');
  });

  it('should get inputDataSet', () => {
    expect(forge.inputDataSet).toEqual({ field: 'name', value: 'John Doe' });
  });

  it('should get forge metadata', () => {
    expect(forge.forge).toEqual({ fieldArgs: { required: true }, fieldType: 'text' });
  });

  it('should get fieldArgs', () => {
    expect(forge.fieldArgs).toEqual({ required: true });
  });

  it('should get fieldType', () => {
    expect(forge.fieldType).toBe('text');
  });

  it('should get htmlInputType', () => {
    expect(forge.htmlInputType).toBe('text');
  });

  it('should get rawData', () => {
    expect(forge.rawData).toEqual(mockData);
  });

  it('should iterate array', () => {
    expect(forge.iterateArray('name', ['a'])).toEqual([{ fieldArgs: {}, fieldType: 'text' }]);
  });

  it('should iterate object', () => {
    expect(forge.iterateObject('name', { a: 1 })).toEqual([{ fieldArgs: {}, fieldType: 'text' }]);
  });
});
