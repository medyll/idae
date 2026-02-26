#!/usr/bin/env node
/*
 * ESM MOCKUP -> Svelte scaffold converter (canonical)
 * Usage: node src/lib/tools/mockup/convert-mockup.js <input-file> [output-dir]
 */

import fs from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';

function parseAttributes(attrText) {
  const attrs = {};
  if (!attrText) return attrs;
  const re = /([a-zA-Z0-9:-]+)(?:="([^"]*)")?/g;
  let m;
  while ((m = re.exec(attrText))) {
    attrs[m[1]] = m[2] === undefined ? true : m[2];
  }
  return attrs;
}

function findOpeningTags(content) {
  const re = /<([a-zA-Z0-9-]+)([^>]*)>/g;
  const tags = [];
  let m;
  while ((m = re.exec(content))) {
    tags.push({ tag: m[1], rawAttrs: m[2] || '', index: m.index });
  }
  return tags;
}

function extractInner(content, tag, fromIndex) {
  const closeRe = new RegExp(`</${tag}>`, 'g');
  closeRe.lastIndex = fromIndex;
  const matchClose = closeRe.exec(content);
  if (!matchClose) return '';
  const start = content.indexOf('>', fromIndex) + 1;
  const end = matchClose.index;
  if (start === 0 || end < start) return '';
  return content.substring(start, end).trim();
}

function makeFilename(tag, id, fallbackIdx) {
  // Prefer tag + id when available. If no id, use tag only (no numeric suffixes).
  const base = id ? `${tag}-${id}` : `${tag}`;
  const safe = base.replace(/[^a-zA-Z0-9-_]/g, '-');
  return `mockup-${safe}.svelte`;
}

async function generateSvelte(tag, id, attrs, inner) {
  // Attempt to load template file from tools/mockup folder (markdown or html)
  const mdTemplatePath = path.resolve('./src/lib/tools/mockup/convert-mockup-template.md');
  const htmlTemplatePath = path.resolve('./src/lib/tools/mockup/convert-mockup-template.html');
  let tplRaw;
  try {
    // Prefer markdown template if present
    tplRaw = await fs.readFile(mdTemplatePath, 'utf8');
    // If it's markdown, try to extract the first ```html fenced block
    const fenceHtml = /```html\s*([\s\S]*?)```/i.exec(tplRaw);
    if (fenceHtml && fenceHtml[1]) {
      tplRaw = fenceHtml[1].trim();
    } else {
      // If no html fence, also try generic triple-backtick block
      const fenceAny = /```(?:html)?\s*([\s\S]*?)```/.exec(tplRaw);
      if (fenceAny && fenceAny[1]) tplRaw = fenceAny[1].trim();
    }
  } catch (e) {
    try {
      tplRaw = await fs.readFile(htmlTemplatePath, 'utf8');
    } catch (e2) {
      tplRaw = null;
    }
  }

  const tpl = tplRaw;
  if (!tpl) {
    throw new Error(`No template found for convert-mockup. Checked paths:\n - ${mdTemplatePath}\n - ${htmlTemplatePath}\nPlease create a template at one of these locations (markdown with an HTML fenced block or an HTML file).`);
  }

  // Helpers
  function pascalCase(str) {
    return str.split(/[-_\s]+/).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
  }

  const compName = pascalCase(tag);
  const attrsJson = JSON.stringify({ tag, id: id || null, attrs }, null, 2);

  // Replace placeholders
  let out = tpl.replace(/{{COMPONENT_NAME}}/g, compName);
  out = out.replace(/{{TAG}}/g, tag);
  out = out.replace(/{{ID}}/g, id ? id : 'null');
  out = out.replace(/{{ATTRS_JSON}}/g, attrsJson);
  // If template needs inner content, replace {{INNER}}
  out = out.replace(/{{INNER}}/g, inner ? inner : '');

  return out;
}

function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

export async function convertMockup(content, outDir = path.resolve('./src/lib/elements')) {
  const tags = findOpeningTags(content);
  // Only generate components for the CMAD semantic pseudo-tags
  const allowed = new Set([
    'row', 'column', 'panel', 'toolbar', 'text-zone', 'chat-bubble', 'tab-bar', 'tab', 'overlay', 'spinner', 'timeline', 'diff-view', 'badge', 'resize-handle'
  ]);
  const filtered = tags.filter(t => allowed.has(t.tag));
  ensureDir(outDir);
  let idx = 1;
  const written = [];
  for (const t of filtered) {
    const attrs = parseAttributes(t.rawAttrs);
    const id = attrs.id || attrs.name || null;
    const inner = extractInner(content, t.tag, t.index);
    const filename = makeFilename(t.tag, id, idx);
    const svelte = await generateSvelte(t.tag, id, attrs, inner);
    const outPath = path.join(outDir, filename);
    try {
      // Always write/overwrite to ensure fresh scaffolds (folder was emptied per request)
      await fs.writeFile(outPath, svelte, 'utf8');
      written.push(outPath);
    } catch (e) {
      // continue
    }
    idx++;
  }
  return written;
}

export async function convertMockupFromFile(inputPath, outDir) {
  const input = path.resolve(inputPath);
  const content = await fs.readFile(input, 'utf8');
  return convertMockup(content, outDir);
}

// CLI
if (process.argv && process.argv[1] && process.argv[1].endsWith('convert-mockup.js')) {
  (async () => {
    const argv = process.argv.slice(2);
    if (argv.length < 1) {
      console.error('Usage: node src/lib/tools/mockup/convert-mockup.js <input-file> [output-dir]');
      process.exit(2);
    }
    try {
      const written = await convertMockupFromFile(argv[0], argv[1]);
      console.log('Generated', written.length, 'component(s):');
      for (const w of written) console.log(' -', w);
    } catch (err) {
      console.error('Error:', err?.message || String(err));
      process.exit(3);
    }
  })();
}
