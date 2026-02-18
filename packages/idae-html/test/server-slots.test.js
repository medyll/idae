import { describe, it, expect } from 'vitest';
import { applyServerSlotsToHtml, collectSlotsFromHtml } from '../scripts/server-slots.js';

describe('server-slots utilities', () => {
  it('escapes XSS when allowHtml is false', () => {
    const tpl = '<div><slot name="a">fallback</slot></div>';
    const out = applyServerSlotsToHtml(tpl, { a: '<img src=x onerror=alert(1)>' }, { allowHtml: false });
    expect(out).toContain('&lt;img');
  });

  it('preserves fallback when slot missing', () => {
    const tpl = '<section><slot name="header">HeaderFallback</slot></section>';
    const out = applyServerSlotsToHtml(tpl, {}, { allowHtml: false });
    expect(out).toContain('HeaderFallback');
  });

  it('truncates when total size exceeds limit', () => {
    let html = '';
    for (let i = 0; i < 10; i++) {
      html += `<div data-slot="s${i}">${'x'.repeat(1024 * 30)}</div>`; // 30 KB each
    }
    const { slots, truncated } = collectSlotsFromHtml(html, 50 * 1024); // 50 KB limit
    expect(truncated).toBe(true);
    expect(Object.keys(slots).length).toBeGreaterThan(0);
  });
});
