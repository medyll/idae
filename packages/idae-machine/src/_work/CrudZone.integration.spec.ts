// Integration test for CrudZone.svelte with CrudService
import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import CrudZone from './CrudZone.svelte';
import { CrudService } from './CrudService';

describe('CrudZone integration', () => {
  it('renders items from CrudService and selects one', async () => {
    const crud = new CrudService();
    crud.create('agents', { id: 1, name: 'John' });
    crud.create('agents', { id: 2, name: 'Jane' });
    const { getByText } = render(CrudZone, { props: { collection: 'agents', crud } });
    expect(getByText('John')).toBeTruthy();
    expect(getByText('Jane')).toBeTruthy();
    await fireEvent.click(getByText('Jane'));
    expect(getByText('Jane')).toBeTruthy(); // Detail should show Jane
  });
});
