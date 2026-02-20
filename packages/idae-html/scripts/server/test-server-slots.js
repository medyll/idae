// Simple test runner for server-slots utilities
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { applyServerSlotsToHtml, collectSlotsFromHtml } from './server-slots.js';

// Vitest-friendly registration function: call this from a test file to register
// the same tests with Vitest's `describe`/`it`/`expect` API.
export function registerVitestTests(vdescribe, vit, vexpect) {
  const d = vdescribe || describe;
  const it = vit || globalThis.it;
  const expect = vexpect || globalThis.expect;

  d('server-slots utilities', () => {
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
}

// Backwards-compatible node runner: keep ability to execute `node scripts/test-server-slots.js`
function testXssEscaping() {
  const tpl = '<div><slot name="a">fallback</slot></div>';
  const out = applyServerSlotsToHtml(tpl, { a: '<img src=x onerror=alert(1)>' }, { allowHtml: false });
  assert(out.includes('&lt;img'), 'XSS content should be escaped');
}

function testFallback() {
  const tpl = '<section><slot name="header">HeaderFallback</slot></section>';
  const out = applyServerSlotsToHtml(tpl, {}, { allowHtml: false });
  assert(out.includes('HeaderFallback'), 'Fallback should be present when slot absent');
}

function testTruncation() {
  let html = '';
  for (let i = 0; i < 10; i++) {
    html += `<div data-slot="s${i}">${'x'.repeat(1024 * 30)}</div>`; // 30 KB each
  }
  const { slots, truncated } = collectSlotsFromHtml(html, 50 * 1024); // 50 KB limit
  assert(truncated === true, 'Should truncate when total exceeds limit');
  assert(Object.keys(slots).length > 0, 'Should collect some slots before truncation');
}

async function run() {
  try {
    testXssEscaping();
    testFallback();
    testTruncation();
    console.log('All server-slots tests passed');
    process.exit(0);
  } catch (e) {
    console.error('Test failed:', e.message);
    process.exit(1);
  }
}

// If executed directly with Node, run tests via the node runner.
const scriptPath = fileURLToPath(import.meta.url);
if (process.argv[1] === scriptPath) run();
