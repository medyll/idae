import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/svelte';
import ContextMenuContent from './ContextMenuContent.svelte';

describe('ContextMenuContent', () => {
  beforeEach(() => {
    // Mock machine
    vi.mock('$lib/main/machine.js', () => ({
      machine: {
        store: vi.fn().mockReturnValue({
          records: [
            { id: '123', name: 'Test Record' }
          ]
        }),
        rights: {
          checkAccess: vi.fn().mockReturnValue(true)
        },
        framer: {
          loadInDialog: vi.fn()
        },
        logic: {
          collectionOr: vi.fn().mockReturnValue(null)
        },
        collection: vi.fn().mockReturnValue({
          delete: vi.fn().mockResolvedValue(true)
        })
      }
    }));
  });

  afterEach(() => {
    cleanup();
    // vi.restoreAllMocks() would strip the plain vi.fn().mockReturnValue(true) below
    // (no "original" non-mocked implementation to restore to → becomes a no-op
    // returning undefined after the first test) — this made every test after the
    // first see checkAccess()=undefined, silently failing rights-gated assertions.
    // clearAllMocks() resets call history without touching mock implementations.
    vi.clearAllMocks();
  });

  it('should render menu items based on permissions', () => {
    const { container } = render(ContextMenuContent, {
      props: {
        collection: 'test',
        collectionId: '123'
      }
    });

    // Should have menu items
    const items = container.querySelectorAll('.context-menu-item');
    expect(items.length).toBeGreaterThan(0);
    
    // Should have View, Edit, Delete, Duplicate items (text includes icons)
    const labels = Array.from(items).map(item => item.textContent?.trim());
    expect(labels.some(l => l?.includes('View'))).toBe(true);
    expect(labels.some(l => l?.includes('Edit'))).toBe(true);
    expect(labels.some(l => l?.includes('Delete'))).toBe(true);
    expect(labels.some(l => l?.includes('Duplicate'))).toBe(true);
  });

  it('should handle custom actions from vars', () => {
    const customActions = JSON.stringify([
      { label: 'Custom Action', icon: 'star', action: 'loadInDialog:explorer' }
    ]);

    const { container } = render(ContextMenuContent, {
      props: {
        collection: 'test',
        collectionId: '123',
        vars: { customActions }
      }
    });

    // Should have custom action (text includes icon)
    const items = container.querySelectorAll('.context-menu-item');
    const labels = Array.from(items).map(item => item.textContent?.trim());
    expect(labels.some(l => l?.includes('Custom Action'))).toBe(true);
  });

  it('should show divider when both standard and custom actions are present', () => {
    const customActions = JSON.stringify([
      { label: 'Custom Action', icon: 'star' }
    ]);

    const { container } = render(ContextMenuContent, {
      props: {
        collection: 'test',
        collectionId: '123',
        vars: { customActions }
      }
    });

    // Should have divider
    const divider = container.querySelector('.context-menu-divider');
    expect(divider).toBeTruthy();
  });

  it('should respect disabled state for custom actions', () => {
    const customActions = JSON.stringify([
      { label: 'Disabled Action', disabled: true }
    ]);

    const { container } = render(ContextMenuContent, {
      props: {
        collection: 'test',
        collectionId: '123',
        vars: { customActions }
      }
    });

    // Should have disabled item
    const disabledItem = container.querySelector('.context-menu-item.disabled');
    expect(disabledItem).toBeTruthy();
  });
});