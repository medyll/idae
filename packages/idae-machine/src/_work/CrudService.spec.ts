// Unit test for CrudService.ts
import { describe, it, expect } from 'vitest';
import { CrudService } from './CrudService';

describe('CrudService', () => {
  it('creates and lists items', () => {
    const crud = new CrudService();
    crud.create('agents', { id: 1, name: 'John' });
    crud.create('agents', { id: 2, name: 'Jane' });
    const list = crud.list('agents');
    expect(list.length).toBe(2);
    expect(list[0].name).toBe('John');
  });

  it('gets item by id', () => {
    const crud = new CrudService();
    crud.create('agents', { id: 1, name: 'John' });
    const item = crud.get('agents', 1);
    expect(item.name).toBe('John');
  });

  it('updates item', () => {
    const crud = new CrudService();
    crud.create('agents', { id: 1, name: 'John' });
    crud.update('agents', 1, { name: 'Johnny' });
    const item = crud.get('agents', 1);
    expect(item.name).toBe('Johnny');
  });

  it('deletes item', () => {
    const crud = new CrudService();
    crud.create('agents', { id: 1, name: 'John' });
    const deleted = crud.delete('agents', 1);
    expect(deleted).toBe(true);
    expect(crud.list('agents').length).toBe(0);
  });
});
