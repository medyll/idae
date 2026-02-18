import { describe, it, expect } from 'vitest';
import { applyServerSlotsToHtml, collectSlotsFromHtml } from '../scripts/server-slots.js';
import { parse } from 'node-html-parser';

describe('server-slots integration', () => {
  it('parent-provided slot overrides template fallback', () => {
    const fetchedTemplate = '<div><slot name="test">default value</slot></div>';
    const slots = { test: 'new value' };
    const out = applyServerSlotsToHtml(fetchedTemplate, slots, { allowHtml: false });
    expect(out).toContain('new value');
    expect(out).not.toContain('default value');
  });

  it('collectSlotsFromHtml removes data-slot and returns cleaned html', () => {
    const html = '<div data-slot="test">default value</div><div><slot name="test">fallback</slot></div>';
    const res = collectSlotsFromHtml(html, 200 * 1024, { debug: false });
    expect(res.slots.test).toBe('default value');
    expect(res.html).not.toContain('data-slot');
    // ensure cleaned template still contains the <slot> element
    expect(res.html).toContain('<slot name="test">fallback</slot>');
  });

  it('emulated full flow: transform child data-slot -> slot fallback + parent provided slot', () => {
    // fetched template originally had data-slot
    const fetched = '<section><div data-slot="test">default value</div></section>';
    // idae-server transforms child data-slot into slot fallback before insertion
    const fetchedRoot = parse(fetched);
    const childSlots = fetchedRoot.querySelectorAll('[data-slot]');
    for (const s of childSlots) {
      const nm = s.getAttribute('data-slot') || 'default';
      const inner = s.innerHTML || '';
      s.replaceWith(`<slot name="${nm}">${inner}</slot>`);
    }
    const transformed = fetchedRoot.toString();

    // parent provided slots
    const parentSlots = { test: 'new value' };
    const out = applyServerSlotsToHtml(transformed, parentSlots, { allowHtml: false });
    expect(out).toContain('new value');
    expect(out).not.toContain('default value');
  });
});
