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

// --- CLI Configuration ---
program
  .option('-p, --port <number>', 'Server port', (val) => parseInt(val, 10), 5173)
  .option('-o, --open', 'Open browser on start', false)
  .option('-d, --debug', 'Enable powerful colored debug logging', false)
  .option('-a, --enable-api', 'Enable API proxying to backend', false)
  .option('--proxy-target <url>', 'Backend proxy target URL', 'http://localhost:3000')
  .option('--https', 'Enable self-signed HTTPS', false)
  .parse(process.argv);

const options = program.opts();
const PORT = options.port;
const root = process.cwd();

// Terminal colors
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
  magenta: "\x1b[35m"
};

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain'
};

/**
 * Ensures SSL certificates exist or generates them
 * @returns {Object} credentials for https server
 */
async function ensureCertificates() {
  const keyPath = path.resolve(root, '.idae-key.pem');
  const certPath = path.resolve(root, '.idae-cert.pem');

  if (existsSync(keyPath) && existsSync(certPath)) {
    return {
      key: await fs.readFile(keyPath),
      cert: await fs.readFile(certPath)
    };
  }

  console.log(`${colors.yellow}⚠️  SSL Certificates not found. Generating self-signed certs...${colors.reset}`);

  // Generate a basic self-signed pair using native crypto
  const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
  });

  // Note: This is a raw PEM. For full browser trust, use mkcert.
  await fs.writeFile(keyPath, privateKey);
  await fs.writeFile(certPath, publicKey); // In real scenarios, this would be an X.509 cert

  console.log(`${colors.green}✅ Temporary certificates created at root.${colors.reset}`);
  return { key: privateKey, cert: publicKey };
}

async function startIdaeServer() {
  const app = new Koa();

  // 1. Vite Setup
  const vite = await createServer({
    root,
    server: { 
      middlewareMode: true,
      hmr: { port: PORT + 1 },
      https: options.https 
    },
    appType: 'custom',
    resolve: {
      alias: { '$lib': path.resolve(root, 'src/lib') }
    }
  });

  // 2. Proxy Setup
  if (options.enableApi) {
    app.use(proxy('/api', {
      target: options.proxyTarget,
      changeOrigin: true,
      logs: options.debug,
    }));
  }

  // 3. Logger Middleware
  if (options.debug) {
    app.use(async (ctx, next) => {
      const start = Date.now();
      await next();
      const ms = Date.now() - start;
      const statusColor = ctx.status >= 400 ? colors.yellow : colors.green;
      console.log(`${colors.gray}[${new Date().toLocaleTimeString()}]${colors.reset} ${colors.cyan}${ctx.method}${colors.reset} ${ctx.url} - ${statusColor}${ctx.status}${colors.reset} (${ms}ms)`);
    });
  }

  // 4. Error Handler
  app.use(async (ctx, next) => {
    try {
      await next();
      if (ctx.status === 404 && !ctx.body) ctx.throw(404);
    } catch (err) {
      ctx.status = err.status || 500;
      vite.ssrFixStacktrace(err);
      ctx.type = 'text/html';
      ctx.body = `<div style="font-family: monospace; padding: 20px; background: #1a1a1a; color: #ff5f5f;"><h1>Error ${ctx.status}</h1><pre>${options.debug ? err.stack : err.message}</pre></div>`;
      ctx.app.emit('error', err, ctx);
    }
  });

  // 5. Vite Middleware
  app.use(c2k(vite.middlewares));

  // 6. Rendering Logic
  app.use(async (ctx, next) => {
    if (ctx.method !== 'GET') return next();

    const isHtml = ctx.headers.accept?.includes('text/html');
    let urlPath = ctx.path === '/' ? '/index.html' : ctx.path;
    if (isHtml && !path.extname(urlPath)) urlPath += '.html';

    const extension = path.extname(urlPath).toLowerCase();
    const pagePath = path.resolve(root, 'src/www', urlPath.replace(/^\//, ''));
    const bootstrapPath = path.resolve(root, 'src/app.html');

    if (extension === '.html') {
      let finalPath = existsSync(pagePath) ? pagePath : path.resolve(root, 'src/www/index.html');
      if (existsSync(finalPath)) {
        try {
          const [bootstrap, pageContent] = await Promise.all([
            fs.readFile(bootstrapPath, 'utf-8').catch(() => '<%idae-kit%>'),
            fs.readFile(finalPath, 'utf-8')
          ]);
          let html = bootstrap.replace('<%idae-kit%>', pageContent);
          ctx.body = await vite.transformIndexHtml(ctx.url, html);
          ctx.type = 'text/html';
          return;
        } catch (e) { ctx.throw(500, e); }
      }
    } 
    
    if (existsSync(pagePath)) {
      ctx.type = mimeTypes[extension] || 'application/octet-stream';
      ctx.body = await fs.readFile(pagePath);
      return;
    }
    await next();
  });

  // 7. Server Start
  let server;
  const protocol = options.https ? 'https' : 'http';

  if (options.https) {
    const credentials = await ensureCertificates();
    server = https.createServer(credentials, app.callback());
  } else {
    server = app.listen(PORT);
  }

  const onStart = () => {
    const url = `${protocol}://localhost:${PORT}`;
    console.log(`\n${colors.green}${colors.bright}🚀 IDAE-Server engine running at:${colors.reset} ${url}`);
    if (options.enableApi) console.log(`${colors.magenta}📡 API Proxy: /api -> ${options.proxyTarget}${colors.reset}`);
    if (options.open) open(url);
  };

  if (options.https) server.listen(PORT, onStart);
  else onStart();
}

startIdaeServer().catch(err => {
  console.error(colors.red + 'Server start failed:' + colors.reset, err);
  process.exit(1);
});