// Unit test for CollectionList.svelte
import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import CollectionList from './CollectionList.svelte';

describe('CollectionList', () => {
  it('renders collection name and display mode', () => {
    const { getByText } = render(CollectionList, { props: { collection: 'agents', displayMode: 'grid' } });
    expect(getByText('agents (grid)')).toBeTruthy();
  });

  it('shows message when no items', () => {
    const { getByText } = render(CollectionList, { props: { collection: 'agents' } });
    expect(getByText('No items to display.')).toBeTruthy();
  });
});
