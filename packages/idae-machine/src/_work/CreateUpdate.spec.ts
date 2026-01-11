// Unit test for CreateUpdate.svelte
import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import CreateUpdate from './CreateUpdate.svelte';

describe('CreateUpdate', () => {
  it('renders collection and mode', () => {
    const { getByText } = render(CreateUpdate, { props: { collection: 'agents', mode: 'create', showFields: ['name', 'code'] } });
    expect(getByText('agents - create')).toBeTruthy();
  });

  it('renders fields and submit button', () => {
    const { getByLabelText, getByText } = render(CreateUpdate, { props: { collection: 'agents', mode: 'create', showFields: ['name', 'code'] } });
    expect(getByLabelText('name')).toBeTruthy();
    expect(getByLabelText('code')).toBeTruthy();
    expect(getByText('Create')).toBeTruthy();
  });

  it('shows FK section if showFks is true', () => {
    const { getByText } = render(CreateUpdate, { props: { collection: 'agents', mode: 'create', showFields: ['name'], showFks: true } });
    expect(getByText('Foreign keys section (to implement)')).toBeTruthy();
  });
});
