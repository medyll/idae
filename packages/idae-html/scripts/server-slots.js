// Utilities for server-side slot processing
import { parse } from 'node-html-parser';

const colors = {
  reset: "\x1b[0m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  red: "\x1b[31m"
};

export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function applyServerSlotsToHtml(html, slots = {}, options = { allowHtml: false, debug: false }) {
  if (!slots || Object.keys(slots).length === 0) return html;
  const allowHtml = !!options.allowHtml;
  const debug = !!options.debug;
  if (debug) console.log(`${colors.cyan}[server-slots] applyServerSlotsToHtml called with ${Object.keys(slots).length} provided slots${colors.reset}`);

  const applied = new Set();

  // Replace named slots: <slot name="...">fallback</slot>
  html = html.replace(/<slot[^>]*name=["']([^"']+)["'][^>]*>([\s\S]*?)<\/slot>/gi, (m, name, fallback) => {
    const provided = slots[name];
    if (provided == null) {
      if (debug) console.log(`${colors.cyan}[server-slots] slot "${name}" not provided, keeping fallback${colors.reset}`);
      return fallback || '';
    }
    applied.add(name);
    if (debug) {
      const preview = String(provided).replace(/\s+/g, ' ').slice(0, 120);
      console.log(`${colors.cyan}[server-slots] applying slot "${name}" (provided length=${String(provided).length}) preview="${preview}${String(provided).length > 120 ? '...' : ''}"${colors.reset}`);
    }
    if (!allowHtml) {
      if (debug) console.log(`${colors.cyan}[server-slots] escaping content for slot "${name}"${colors.reset}`);
      return escapeHtml(provided);
    }
    return provided;
  });

  // Replace unnamed/default slots
  html = html.replace(/<slot(?![^>]*name=)[^>]*>([\s\S]*?)<\/slot>/gi, (m, fallback) => {
    const provided = slots['default'];
    if (provided == null) {
      if (debug) console.log(`${colors.cyan}[server-slots] default slot not provided, keeping fallback${colors.reset}`);
      return fallback || '';
    }
    applied.add('default');
    if (debug) {
      const preview = String(provided).replace(/\s+/g, ' ').slice(0, 120);
      console.log(`${colors.cyan}[server-slots] applying default slot (length=${String(provided).length}) preview="${preview}${String(provided).length > 120 ? '...' : ''}"${colors.reset}`);
    }
    if (!allowHtml) {
      if (debug) console.log(`${colors.cyan}[server-slots] escaping content for default slot${colors.reset}`);
      return escapeHtml(provided);
    }
    return provided;
  });

  if (debug) console.log(`${colors.cyan}[server-slots] applied slots: ${Array.from(applied).join(', ') || '(none)'} ${colors.reset}`);

  return html;
}

/**
 * Collect slots from an HTML string using [data-slot] attributes.
 * Returns { slots: Record<string,string>, truncated: boolean }
 */
export function collectSlotsFromHtml(html, maxBytes = 200 * 1024, options = { debug: false }) {
  const debug = !!options.debug;
  const root = parse(html);
  const slotEls = root.querySelectorAll('[data-slot]');
  const slots = {};
  let total = 0;
  let truncated = false;
  for (const el of slotEls) {
    const name = el.getAttribute('data-slot') || 'default';
    const content = el.innerHTML || '';
    const size = Buffer.byteLength(content, 'utf8');
    if (debug) console.log(`${colors.cyan}[server-slots] found data-slot="${name}" size=${size} bytes${colors.reset}`);
    if (debug && content.length > 0) {
      const preview = content.replace(/\s+/g, ' ').slice(0, 120);
      console.log(`${colors.cyan}[server-slots] preview for "${name}": "${preview}${content.length > 120 ? '...' : ''}"${colors.reset}`);
    }
    if (slots[name] != null) {
      if (debug) console.log(`${colors.yellow}[server-slots] warning: duplicate data-slot name "${name}" — overwriting previous value${colors.reset}`);
    }
    if (total + size > maxBytes) {
      truncated = true;
      if (debug) console.debug(`[server-slots] truncating slots collection: total ${total} + ${size} > ${maxBytes}`);
      break;
    }
    total += size;
    slots[name] = content;
    // remove the source element from the DOM so its raw content is not emitted
    // after slot application (prevents duplicate display)
    try { el.remove(); } catch (e) { /* ignore */ }
  }
  if (debug) console.log(`${colors.cyan}[server-slots] collected ${Object.keys(slots).length} slots, total=${total} bytes, truncated=${truncated}${colors.reset}`);
  return { slots, truncated, html: root.toString() };
}

// Render cache (in-memory by default, optional Redis backend)
import crypto from 'node:crypto';
import Redis from 'ioredis';

const DEFAULT_TTL_S = parseInt(process.env.IDAE_RENDER_CACHE_TTL_S || '60', 10);
const DEFAULT_MAX = parseInt(process.env.IDAE_RENDER_CACHE_MAX || '1000', 10);
const CACHE_STORE = process.env.IDAE_RENDER_CACHE_STORE || 'memory';
const REDIS_URL = process.env.IDAE_RENDER_CACHE_REDIS_URL || process.env.REDIS_URL || 'redis://127.0.0.1:6379';

const RENDER_CACHE = new Map();
let redisClient = null;
const TAG_MAP = new Map(); // in-memory tag -> Set(keys)

function pruneRenderCache(maxEntries = DEFAULT_MAX) {
  if (RENDER_CACHE.size <= maxEntries) return;
  const keys = RENDER_CACHE.keys();
  while (RENDER_CACHE.size > maxEntries) {
    const k = keys.next().value;
    RENDER_CACHE.delete(k);
  }
}

async function ensureRedis() {
  if (redisClient) return redisClient;
  try {
    redisClient = new Redis(REDIS_URL);
    // simple ping to validate
    await redisClient.ping();
    return redisClient;
  } catch (e) {
    redisClient = null;
    throw e;
  }
}

export async function renderWithCache(templateHtml, props = {}, slots = {}, options = { ttlS: DEFAULT_TTL_S, maxEntries: DEFAULT_MAX, allowHtml: false, debug: false }) {
  const debug = !!options.debug;
  const keyObj = { props, slots };
  const hash = crypto.createHash('sha256').update(String(templateHtml) + JSON.stringify(keyObj)).digest('hex');
  const now = Date.now();

  if (debug) console.log(`${colors.cyan}[server-slots] renderWithCache key=${hash} store=${CACHE_STORE}${colors.reset}`);

  if (CACHE_STORE === 'redis') {
    try {
      const r = await ensureRedis();
      const cached = await r.get(`idae:render:${hash}`);
      if (cached) {
        if (debug) console.log(`${colors.cyan}[server-slots] redis cache hit for ${hash}${colors.reset}`);
        return cached;
      }
      if (debug) console.log(`${colors.cyan}[server-slots] redis cache miss for ${hash}, rendering${colors.reset}`);
      const html = applyServerSlotsToHtml(String(templateHtml), slots, { allowHtml: !!options.allowHtml, debug });
      await r.set(`idae:render:${hash}`, html, 'EX', options.ttlS || DEFAULT_TTL_S);
      if (debug) console.log(`${colors.cyan}[server-slots] stored render into redis key=idae:render:${hash} ttl=${options.ttlS || DEFAULT_TTL_S}s${colors.reset}`);
      if (options.tag) {
        try { await r.sadd(`idae:render:tag:${options.tag}`, `idae:render:${hash}`); } catch (e) { /* ignore tag set failures */ }
      }
      return html;
    } catch (e) {
      if (debug) console.log(`${colors.yellow}[server-slots] redis cache error: ${e.message}, falling back to memory${colors.reset}`);
    }
  }

  const entry = RENDER_CACHE.get(hash);
  if (entry && (now - entry.ts < (options.ttlS || DEFAULT_TTL_S) * 1000)) {
    if (debug) console.log(`${colors.cyan}[server-slots] memory cache hit for ${hash}${colors.reset}`);
    return entry.html;
  }

  if (debug) console.log(`${colors.cyan}[server-slots] memory cache miss for ${hash}, rendering${colors.reset}`);
  const html = applyServerSlotsToHtml(String(templateHtml), slots, { allowHtml: !!options.allowHtml, debug });
  RENDER_CACHE.set(hash, { html, ts: now });
  if (debug) console.log(`${colors.cyan}[server-slots] stored render into memory key=${hash} ttl=${options.ttlS || DEFAULT_TTL_S}s${colors.reset}`);
  if (options.tag) {
    const set = TAG_MAP.get(options.tag) || new Set();
    set.add(`idae:render:${hash}`);
    TAG_MAP.set(options.tag, set);
    if (debug) console.log(`${colors.cyan}[server-slots] added key to tag ${options.tag}${colors.reset}`);
  }
  pruneRenderCache(options.maxEntries || DEFAULT_MAX);
  if (debug) console.log(`${colors.cyan}[server-slots] pruneRenderCache complete (size=${RENDER_CACHE.size})${colors.reset}`);
  return html;
}

export async function invalidateRenderTag(tag, options = { debug: false }) {
  const debug = !!options.debug;
  if (!tag) return 0;
  if (CACHE_STORE === 'redis') {
    try {
      const r = await ensureRedis();
      const setKey = `idae:render:tag:${tag}`;
      const members = await r.smembers(setKey);
      if (!members || members.length === 0) return 0;
      const pipeline = r.pipeline();
      members.forEach(k => pipeline.del(k));
      pipeline.del(setKey);
      await pipeline.exec();
          if (debug) console.log(`${colors.cyan}[server-slots] invalidated ${members.length} redis render keys for tag=${tag}${colors.reset}`);
      return members.length;
    } catch (e) {
          if (debug) console.log(`${colors.yellow}[server-slots] invalidateRenderTag redis error: ${e.message}${colors.reset}`);
      return 0;
    }
  }

  // in-memory invalidation
  const set = TAG_MAP.get(tag);
  if (!set) return 0;
  let count = 0;
  for (const k of set) {
    if (RENDER_CACHE.delete(k.replace(/^idae:render:/, ''))) {
      count++;
    }
  }
  TAG_MAP.delete(tag);
  if (debug) console.log(`${colors.cyan}[server-slots] invalidated ${count} in-memory render keys for tag=${tag}${colors.reset}`);
  return count;
}
