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

export async function renderWithCache(templateHtml, props = {}, slots = {}, options = { ttlS: DEFAULT_TTL_S, maxEntries: DEFAULT_MAX, allowHtml: false }) {
  const keyObj = { props, slots };
  const hash = crypto.createHash('sha256').update(String(templateHtml) + JSON.stringify(keyObj)).digest('hex');
  const now = Date.now();

  if (CACHE_STORE === 'redis') {
    try {
      const r = await ensureRedis();
      const cached = await r.get(`idae:render:${hash}`);
      if (cached) return cached;
      const html = applyServerSlotsToHtml(String(templateHtml), slots, { allowHtml: !!options.allowHtml });
      await r.set(`idae:render:${hash}`, html, 'EX', options.ttlS || DEFAULT_TTL_S);
      if (options.tag) {
        try { await r.sadd(`idae:render:tag:${options.tag}`, `idae:render:${hash}`); } catch (e) { /* ignore tag set failures */ }
      }
      return html;
    } catch (e) {
      // fallback to memory cache on error
    }
  }

  const entry = RENDER_CACHE.get(hash);
  if (entry && (now - entry.ts < (options.ttlS || DEFAULT_TTL_S) * 1000)) {
    return entry.html;
  }

  const html = applyServerSlotsToHtml(String(templateHtml), slots, { allowHtml: !!options.allowHtml });
  RENDER_CACHE.set(hash, { html, ts: now });
  if (options.tag) {
    const set = TAG_MAP.get(options.tag) || new Set();
    set.add(`idae:render:${hash}`);
    TAG_MAP.set(options.tag, set);
  }
  pruneRenderCache(options.maxEntries || DEFAULT_MAX);
  return html;
}

export async function invalidateRenderTag(tag) {
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
      return members.length;
    } catch (e) {
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
  return count;
}
