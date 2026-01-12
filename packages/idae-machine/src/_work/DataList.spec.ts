// Unit test for DataList.svelte
import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import DataList from './DataList.svelte';

describe('DataList', () => {
  it('renders collection name and display mode', () => {
    const { getByText } = render(DataList, { props: { collection: 'agents', displayMode: 'grid' } });
    expect(getByText('agents (grid)')).toBeTruthy();
  });

  it('shows message when no items', () => {
    const { getByText } = render(DataList, { props: { collection: 'agents' } });
    expect(getByText('No items to display.')).toBeTruthy();
  });
});
