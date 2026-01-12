import { describe, it, expect } from 'vitest';
import { idbqlEvent } from './idbqlEvent.svelte';

describe('idbqlEvent', () => {
  it('should be defined', () => {
    expect(idbqlEvent).toBeDefined();
  });
  it('should emit and listen to events', () => {
    if (idbqlEvent && typeof idbqlEvent.on === 'function' && typeof idbqlEvent.emit === 'function') {
      let called = false;
      idbqlEvent.on('test', () => { called = true; });
      idbqlEvent.emit('test');
      expect(called).toBe(true);
    }
  });
});
