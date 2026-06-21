import { describe, it, expect, vi } from 'vitest';
import { runDemo, mockApiClient } from './storage-demo.js';

describe('Storage Adapters Demo', () => {
  it('should run demo without errors', async () => {
    // Mock console.log to avoid clutter in test output
    const originalConsoleLog = console.log;
    console.log = vi.fn();

    try {
      await runDemo();
      expect(console.log).toHaveBeenCalled();
    } finally {
      console.log = originalConsoleLog;
    }
  });

  it('should have working mock API client', () => {
    expect(mockApiClient).toHaveProperty('get');
    expect(mockApiClient).toHaveProperty('create');
    expect(mockApiClient).toHaveProperty('update');
    expect(mockApiClient).toHaveProperty('delete');
    expect(mockApiClient).toHaveProperty('query');
  });
});