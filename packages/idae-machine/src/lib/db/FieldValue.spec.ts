// Unit test for FieldValue.svelte
import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import FieldValue from './FieldValue.svelte';

describe('FieldValue', () => {
  it('renders label and value in show mode', () => {
    const { getByText } = render(FieldValue, { props: { collection: 'agents', fieldName: 'name', data: { name: 'John' }, mode: 'show' } });
    expect(getByText('name')).toBeTruthy();
    expect(getByText('John')).toBeTruthy();
  });

  it('renders input in edit mode with editInPlace', () => {
    const { getByLabelText } = render(FieldValue, { props: { collection: 'agents', fieldName: 'name', data: { name: 'John' }, mode: 'edit', editInPlace: true } });
    expect(getByLabelText('name')).toBeTruthy();
  });

  it('shows (empty) if value is missing', () => {
    const { getByText } = render(FieldValue, { props: { collection: 'agents', fieldName: 'name', data: {}, mode: 'show' } });
    expect(getByText('(empty)')).toBeTruthy();
  });
});
