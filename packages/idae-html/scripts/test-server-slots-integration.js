import assert from 'node:assert/strict';
import { collectSlotsFromHtml, renderWithCache, invalidateRenderTag } from './server-slots.js';

async function testIntegrationReplacement() {
  const html = '<div data-slot="a"><img src=x onerror=alert(1)></div><section><slot name="a">fallback</slot></section>';
  const collected = collectSlotsFromHtml(html, 200 * 1024);
  const out = await renderWithCache(html, {}, collected.slots, { allowHtml: false });
  assert(out.includes('&lt;img'), 'slot content should be escaped by default');
  assert(out.includes('<section>'), 'section should remain');
}

async function testAllowHtmlFlag() {
  const html = '<div data-slot="a"><b>OK</b></div><section><slot name="a">fallback</slot></section>';
  const collected = collectSlotsFromHtml(html, 200 * 1024);
  const out = await renderWithCache(html, {}, collected.slots, { allowHtml: true, tag: 'test:allow' });
  assert(out.includes('<b>OK</b>'), 'when allowHtml=true slot HTML should be inserted raw');
}

async function testInvalidateTagMemory() {
  const html = '<div data-slot="x">data</div><div><slot name="x">fb</slot></div>';
  const collected = collectSlotsFromHtml(html, 200 * 1024);
  // render with a tag so it's tracked in TAG_MAP (memory)
  await renderWithCache(html, {}, collected.slots, { allowHtml: false, tag: 'component:test' });
  const removed = await invalidateRenderTag('component:test');
  assert(removed > 0, 'invalidateRenderTag should remove at least one entry');
}

async function run() {
  try {
    await testIntegrationReplacement();
    await testAllowHtmlFlag();
    await testInvalidateTagMemory();
    console.log('Integration tests passed');
    process.exit(0);
  } catch (e) {
    console.error('Integration test failed:', e);
    process.exit(1);
  }
}

run();
