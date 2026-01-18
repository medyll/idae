import { describe, it, expect } from 'vitest';
import { IDbCollectionValues } from './IDbCollectionValues';

// Mocks
const mockCollectionName = 'agents';
const mockDb = {
  collection: () => ({
    getPresentation: () => 'name',
    getIndexName: () => 'id',
  }),
  parseCollectionFieldName: (collection, field) => ({
    fieldType: field === 'id' ? 'id' : 'text',
    fieldArgs: ['required'],
  }),
};
const mockData = { id: 1, name: 'John Doe' };

describe('IDbCollectionValues', () => {
  const values = new IDbCollectionValues(mockCollectionName, mockDb as any);

  it('should format id field', () => {
    expect(values.format('id', mockData)).toBe('1');
  });

  it('should format text field', () => {
    expect(values.format('name', mockData)).toBe('John Doe');
  });

  it('should get presentation string', () => {
    expect(values.presentation(mockData)).toBe('John Doe');
  });

  it('should get index value', () => {
    expect(values.indexValue(mockData)).toBe(1);
  });

  it('should get inputDataSet', () => {
    expect(values.getInputDataSet('name', mockData)).toEqual({
      'data-collection': 'agents',
      'data-collectionId': '1',
      'data-fieldName': 'name',
      'data-fieldType': 'text',
      'data-fieldArgs': 'required',
    });
  });
});
