// @vitest-environment jsdom
import { render, fireEvent } from '@testing-library/svelte';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import DataForm from '../DataForm.svelte';
import { machine } from '$lib/main/machine.js';

// Minimal shim to ensure machine.store is available in test env
beforeEach(() => {
  // Ensure machine._idbqlState exists and has a stubbed collection with add/update/getAll/where
  (machine as any)._idbqlState = (machine as any)._idbqlState || {};
  (machine as any)._idbqlState['test_collection'] = {
    add: vi.fn(async (obj) => ({ id: 1, ...obj })),
    update: vi.fn(async (id, obj) => ({ id, ...obj })),
    where: vi.fn(() => []),
    getAll: vi.fn(() => [])
  } as any;
});

describe('DataForm submit', () => {
  it('submits create without throwing when no id present', async () => {
    const onsubmit = vi.fn();

    const { getByRole } = render(DataForm, {
      props: {
        collection: 'test_collection',
        mode: 'create',
        onsubmit
      }
    });

    const button = getByRole('button', { name: /submit|valider/i });

    // simulate click
    await fireEvent.click(button);

    expect(machine.store['test_collection'].add).toHaveBeenCalled();
    expect(onsubmit).toHaveBeenCalled();
  });
});
