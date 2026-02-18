import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import crypto from 'node:crypto';
import Koa from 'koa';
import c2k from 'koa-connect';
import proxy from 'koa-proxies';
import { createServer } from 'vite';
import { program } from 'commander';
import open from 'open';
import { parse } from 'node-html-parser';
import { applyServerSlotsToHtml } from './server-slots.js';
import Redis from 'ioredis';
import selfsigned from 'selfsigned';


/**
 * DATA ATTRIBUTES USED:
 * - [data-path]: Local file path (relative to src/www).
 * - [data-http]: Remote or relative URL to fetch.
 * - [data-vars]: Variable url params for data-http or data-path
 * - [data-done]: Processing flag ("1" or "error") to prevent loops.
 * - [data-uuid]: Unique ID added after processing.
 * - [data-source]: Tagged as "local-path" for filesystem reads.
 * - [data-from-cache]: Set to "1" if content served from cache.
 */


// --- CLI Configuration ---
program
  .option('-p, --port <number>', 'Server port', (val) => parseInt(val, 10), 5173)
  .option('-o, --open', 'Open browser on start', false)
  .option('-d, --debug', 'Enable powerful colored debug logging', false)
  .option('-a, --enable-api', 'Enable API proxying to backend', false)
  .option('--proxy-target <url>', 'Backend proxy target URL', 'http://localhost:3000')
  .option('--https', 'Enable self-signed HTTPS', false)
  .option('--fetch-timeout <ms>', 'Timeout for data-http fetches', (val) => parseInt(val, 10), 5000)
  .option('--cache-type <type>', 'Cache storage type (memory or redis)', 'memory')
  .option('--cache-ttl <seconds>', 'Cache TTL in seconds', (val) => parseInt(val, 10), 60)
  .option('--redis-url <url>', 'Redis connection URL', 'redis://127.0.0.1:6379')
  .option('--www <url>', 'Base URL for auto-detection of internal fetches', '')
  .parse(process.argv);


const options = program.opts();
const PORT = options.port;
const root = process.cwd();
const wwwDir = path.resolve(root, 'src/www');
const bootstrapBody = '%idae.body%';


const BASE_URL = options.www || `${options.https ? 'https' : 'http'}://localhost:${PORT}`;


const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m"
};

// Server-side slots feature flags / limits
const ENABLE_SERVER_SLOTS = process.env.IDAE_ENABLE_SERVER_SLOTS !== 'false';
const ALLOW_UNSAFE_SLOTS = process.env.IDAE_ALLOW_UNSAFE_SLOTS === 'true';
const SLOTS_MAX_KB = parseInt(process.env.IDAE_SLOTS_MAX_KB || '200', 10) * 1024; // total KB


// --- Cache Layer ---
let redisClient = null;
const memoryCache = new Map();


const cache = {
  async get(key) {
    if (options.cacheType === 'redis' && redisClient) {
      return await redisClient.get(`idae:cache:${key}`);
    }
    const entry = memoryCache.get(key);
    if (entry && (Date.now() - entry.timestamp < options.cacheTtl * 1000)) {
      return entry.data;
    }
    return null;
  },
  async set(key, value) {
    if (options.cacheType === 'redis' && redisClient) {
      await redisClient.set(`idae:cache:${key}`, value, 'EX', options.cacheTtl);
    } else {
      memoryCache.set(key, { data: value, timestamp: Date.now() });
    }
  }
};


// --- HTML Processor (single pass) ---

async function processHtmlOnce(html) {
  const rootNode = parse(html);

  // 1. Process local-path
  const localEls = rootNode.querySelectorAll('[data-path]:not([data-done])');

  for (const el of localEls) {
    const filePath = el.getAttribute('data-path');
    try {
      const vars = el.getAttribute('data-vars');

      // If data-vars present, perform an internal fetch (GET with querystring)
      if (vars) {
        let url = filePath;
        if (!url.startsWith('http')) url = new URL(url, BASE_URL).href;

        // append vars as querystring
        const sep = url.includes('?') ? '&' : '?';
        url = url + sep + vars.replace(/^\?/, '');

        const cachedData = await cache.get(url);
        if (cachedData) {
          el.set_content(cachedData);
          el.setAttribute('data-uuid', crypto.randomUUID());
          el.setAttribute('data-done', '1');
          el.setAttribute('data-from-cache', '1');
          el.setAttribute('data-source', 'local-path');
          continue;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), options.fetchTimeout);

        try {
          const response = await fetch(url, { signal: controller.signal, headers: { 'x-idae-internal': 'true' } });
          clearTimeout(timeoutId);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const data = await response.text();
          await cache.set(url, data);
          el.set_content(data);
          el.setAttribute('data-uuid', crypto.randomUUID());
          el.setAttribute('data-done', '1');
          el.setAttribute('data-source', 'local-path');
          continue;
        } catch (e) {
          clearTimeout(timeoutId);
          if (options.debug) console.error(`${colors.red}[data-path fetch] ${filePath}: ${e.message}${colors.reset}`);
          // fall through to filesystem attempt below
        }
      }

      // Fallback: local filesystem read (no vars)
      const resolvedPath = path.join(wwwDir, path.join('/', filePath));
      if (!resolvedPath.startsWith(wwwDir)) throw new Error('Traversal blocked');

      if (existsSync(resolvedPath)) {
        const content = await fs.readFile(resolvedPath, 'utf-8');
        el.set_content(content);
        el.setAttribute('data-uuid', crypto.randomUUID());
        el.setAttribute('data-done', '1');
        el.setAttribute('data-source', 'local-path');
      }
    } catch (e) {
      if (options.debug) {
        console.error(`${colors.red}[Path Error] ${filePath}: ${e.message}${colors.reset}`);
      }
      el.set_content(`Path error: ${e.message}`);
      el.setAttribute('data-done', 'error');
    }
  }

  // 2. Process data-http
  const httpEls = rootNode.querySelectorAll('[data-http]:not([data-done])');

  for (const el of httpEls) {
    let url = el.getAttribute('data-http');
    if (!url.startsWith('http')) url = new URL(url, BASE_URL).href;

    // support data-vars appended to data-http
    const httpVars = el.getAttribute('data-vars');
    if (httpVars) {
      const sep = url.includes('?') ? '&' : '?';
      url = url + sep + httpVars.replace(/^\?/, '');
    }

    const cachedData = await cache.get(url);
    if (cachedData) {
      el.set_content(cachedData);
      el.setAttribute('data-uuid', crypto.randomUUID());
      el.setAttribute('data-done', '1');
      el.setAttribute('data-from-cache', '1');
      continue;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.fetchTimeout);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { 'x-idae-internal': 'true' }
      });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.text();

      await cache.set(url, data);
      el.set_content(data);
      el.setAttribute('data-uuid', crypto.randomUUID());
      el.setAttribute('data-done', '1');
    } catch (e) {
      clearTimeout(timeoutId);
      el.set_content(`Fetch error: ${e.message}`);
      el.setAttribute('data-done', 'error');
    }
  }

  let resultHtml = rootNode.toString();

  if (ENABLE_SERVER_SLOTS) {
    try {
      const slotEls = rootNode.querySelectorAll('[data-slot]');
      const slots = {};
      let totalBytes = 0;
      for (const el of slotEls) {
        const name = el.getAttribute('data-slot') || 'default';
        const content = (el.innerHTML || '');
        const size = Buffer.byteLength(content, 'utf8');
        totalBytes += size;
        if (totalBytes > SLOTS_MAX_KB) {
          if (options.debug) console.warn(`${colors.yellow}[slots] total size exceeded ${SLOTS_MAX_KB} bytes, truncating${colors.reset}`);
          break;
        }
        slots[name] = content;
        try { el.setAttribute('data-done', '1'); } catch (e) {}
      }
      resultHtml = applyServerSlotsToHtml(resultHtml, slots, { allowHtml: ALLOW_UNSAFE_SLOTS });
    } catch (e) {
      if (options.debug) console.error(`${colors.red}[slots] apply failed: ${e.message}${colors.reset}`);
    }
  }

  return resultHtml;
}


// --- Utilities ---

async function ensureCertificates() {
  const keyPath = path.resolve(root, '.idae-key.pem');
  const certPath = path.resolve(root, '.idae-cert.pem');
  
  if (existsSync(keyPath) && existsSync(certPath)) {
    return { key: await fs.readFile(keyPath), cert: await fs.readFile(certPath) };
  }

  // Uses selfsigned to create a proper X.509 certificate for the HTTPS server
  const pems = selfsigned.generate([{ name: 'commonName', value: 'localhost' }], { days: 365 });
  await fs.writeFile(keyPath, pems.private);
  await fs.writeFile(certPath, pems.cert);
  
  return { key: pems.private, cert: pems.cert };
}


// --- Server Startup ---

async function startIdaeServer() {
  if (options.cacheType === 'redis') redisClient = new Redis(options.redisUrl);

  const app = new Koa();
  const vite = await createServer({
    root,
    server: { middlewareMode: true, hmr: { port: PORT + 1 }, https: options.https },
    appType: 'custom',
    resolve: { alias: { '$lib': path.resolve(root, 'src/lib') } }
  });

  if (options.enableApi) app.use(proxy('/api', { target: options.proxyTarget, changeOrigin: true }));
  app.use(c2k(vite.middlewares));

  app.use(async (ctx, next) => {
    if (ctx.method !== 'GET') return next();

    const isInternal = ctx.headers['x-idae-internal'] === 'true';
    const isHtml = ctx.headers.accept?.includes('text/html');
    
    let urlPath = ctx.path === '/' ? '/index.html' : ctx.path;
    if (isHtml && !path.extname(urlPath)) urlPath += '.html';

    const pagePath = path.resolve(wwwDir, urlPath.replace(/^\//, ''));
    const bootstrapPath = path.resolve(root, 'src/app.html');

    if (path.extname(urlPath).toLowerCase() === '.html') {
      const finalPath = existsSync(pagePath) ? pagePath : path.resolve(wwwDir, 'index.html');
      
      if (existsSync(finalPath)) {
        try {
          const rawContent = await fs.readFile(finalPath, 'utf-8');

          if (isInternal) {
            ctx.type = 'text/html';
            ctx.body = rawContent;
            return;
          }

          const bootstrap = await fs.readFile(bootstrapPath, 'utf-8').catch(() => bootstrapBody);
          
          // Single-pass processing
          const processedContent = await processHtmlOnce(rawContent);

          const html = bootstrap.replace(bootstrapBody, processedContent);
          ctx.body = await vite.transformIndexHtml(ctx.url, html);
          ctx.type = 'text/html';
          return;
        } catch (e) {
          ctx.throw(500, e);
        }
      }
    }
    
    if (existsSync(pagePath)) {
      ctx.body = await fs.readFile(pagePath);
      return;
    }
    await next();
  });

  const onStart = () => {
    console.log(`\n${colors.green}${colors.bright}🚀 IDAE-Server engine running at ${BASE_URL}${colors.reset}`);
    if (options.open) open(BASE_URL);
  };

  if (options.https) {
    const creds = await ensureCertificates();
    https.createServer(creds, app.callback()).listen(PORT, onStart);
  } else {
    app.listen(PORT, onStart);
  }
}

// Cleanup
process.on('SIGINT', () => {
  if (redisClient) redisClient.quit();
  process.exit();
});

startIdaeServer().catch(err => console.error(err));
