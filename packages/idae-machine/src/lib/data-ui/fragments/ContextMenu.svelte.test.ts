import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/svelte';
import ContextMenu from './ContextMenu.svelte';
import { openContextMenu, closeContextMenu, resetContextMenu } from './contextMenu.svelte.js';
import '@testing-library/jest-dom/vitest';

describe('ContextMenu', () => {
  beforeEach(() => {
    // Mock the machine component registry
    vi.mock('$lib/main/machine.js', () => ({
      machine: {
        componentRegistry: {
          resolve: vi.fn().mockResolvedValue({ default: vi.fn() })
        }
      }
    }));
    
    // Reset context menu state before each test
    resetContextMenu();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('should be closed by default', () => {
    const { container } = render(ContextMenu);
    const menu = container.querySelector('.context-menu');
    expect(menu).not.toHaveClass('open');
  });

  it('should open when openContextMenu is called', async () => {
    const { component } = render(ContextMenu);
    
    // Call openContextMenu directly
    openContextMenu('test', '123', {}, 100, 100);
    
    // Wait for the menu to open
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // The menu should be open
    const menu = document.querySelector('.context-menu') as HTMLElement | null;
    expect(menu?.classList.contains('open')).toBe(true);
    expect(menu?.style.left).toBe('100px');
    expect(menu?.style.top).toBe('100px');
  });

  it('should close when closeContextMenu is called', async () => {
    const { component } = render(ContextMenu);
    
    // Call openContextMenu then closeContextMenu
    openContextMenu('test', '123', {}, 100, 100);
    await new Promise(resolve => setTimeout(resolve, 100));
    closeContextMenu();
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const menu = document.querySelector('.context-menu') as HTMLElement | null;
    expect(menu?.classList.contains('open')).toBe(false);
  });

  it('should close when clicking outside', async () => {
    const { component } = render(ContextMenu);
    
    // Call openContextMenu
    openContextMenu('test', '123', {}, 100, 100);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Click outside the menu
    fireEvent.click(document.body);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const menu = document.querySelector('.context-menu') as HTMLElement | null;
    expect(menu?.classList.contains('open')).toBe(false);
  });

  it('should close when pressing Escape', async () => {
    const { component } = render(ContextMenu);
    
    // Call openContextMenu
    openContextMenu('test', '123', {}, 100, 100);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Press Escape key
    fireEvent.keyDown(document, { key: 'Escape' });
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const menu = document.querySelector('.context-menu') as HTMLElement | null;
    expect(menu?.classList.contains('open')).toBe(false);
  });
});