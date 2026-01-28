import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import CreateUpdate from './CreateUpdate.svelte';

// Basic test: form renders and validates required field

describe('CreateUpdate.svelte', () => {
  it('renders and validates required field', async () => {
    const { getByLabelText, getByRole } = render(CreateUpdate, {
      props: {
        collection: 'agents',
        mode: 'create',
        showFields: ['name'],
        data: {},
        withData: {},
      }
    });
    const input = getByLabelText('name');
    expect(input).toBeTruthy();
    await fireEvent.input(input, { target: { value: '' } });
    await fireEvent.submit(getByRole('form'));
    expect(document.querySelector('.error-message')).toBeTruthy();
  });
});
