import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { processHtmlOnce } from '../scripts/idae-server.js';

describe('processHtmlOnce end-to-end (stubbed fetch)', () => {
  let origFetch;

  beforeEach(() => {
    origFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = origFetch;
  });

  it('applies parent-provided <slot> inside data-http to fetched template', async () => {
    const parentHtml = `
      <div data-http="/test/index.html" data-vars="a=b">
        <slot name="test">new value</slot>
      </div>
    `;

    const fetchedHtml = `
      <div>
        <slot name="test">default value</slot>
      </div>
    `;

    // stub fetch to return the fetchedHtml
    global.fetch = async () => ({ ok: true, text: async () => fetchedHtml });

    const out = await processHtmlOnce(parentHtml);

    expect(out).toContain('new value');
    expect(out).not.toContain('default value');
  });
});
