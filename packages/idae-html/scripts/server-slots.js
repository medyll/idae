// Utilities for server-side slot processing
import { parse } from 'node-html-parser';

export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function applyServerSlotsToHtml(html, slots = {}, options = { allowHtml: false }) {
  if (!slots || Object.keys(slots).length === 0) return html;
  const allowHtml = !!options.allowHtml;

  // Replace named slots: <slot name="...">fallback</slot>
  html = html.replace(/<slot[^>]*name=["']([^"']+)["'][^>]*>([\s\S]*?)<\/slot>/gi, (m, name, fallback) => {
    const provided = slots[name];
    if (provided == null) return fallback || '';
    if (!allowHtml) return escapeHtml(provided);
    return provided;
  });

  // Replace unnamed/default slots
  html = html.replace(/<slot(?![^>]*name=)[^>]*>([\s\S]*?)<\/slot>/gi, (m, fallback) => {
    const provided = slots['default'];
    if (provided == null) return fallback || '';
    if (!allowHtml) return escapeHtml(provided);
    return provided;
  });

  return html;
}

/**
 * Collect slots from an HTML string using [data-slot] attributes.
 * Returns { slots: Record<string,string>, truncated: boolean }
 */
export function collectSlotsFromHtml(html, maxBytes = 200 * 1024) {
  const root = parse(html);
  const slotEls = root.querySelectorAll('[data-slot]');
  const slots = {};
  let total = 0;
  let truncated = false;
  for (const el of slotEls) {
    const name = el.getAttribute('data-slot') || 'default';
    const content = el.innerHTML || '';
    const size = Buffer.byteLength(content, 'utf8');
    if (total + size > maxBytes) {
      truncated = true;
      break;
    }
    total += size;
    slots[name] = content;
  }
  return { slots, truncated };
}
