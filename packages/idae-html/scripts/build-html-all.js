import { build } from 'esbuild';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const moduleDir = path.resolve('src/lib/moduleLib');
const outDir = path.resolve('dist');

function globalNameFrom(filename) {
  return filename.replace(/[^a-zA-Z0-9]/g, '_');
}

async function buildOne(entryPath) {
  const name = path.basename(entryPath, path.extname(entryPath));
  const tmpFile = path.join(outDir, `${name}.tmp.js`);
  const outHtml = path.join(outDir, `${name}.html`);

  await build({
    entryPoints: [entryPath],
    outfile: tmpFile,
    bundle: true,
    format: 'iife',
    globalName: globalNameFrom(name),
    platform: 'browser',
    minify: true,
    sourcemap: false,
    target: ['es2020']
  });

  const js = fs.readFileSync(tmpFile, 'utf8');

  const wrapper = `
// Auto-initializer for ${name}: initialize elements with data-component="${name}"
(function(){
  try {
    var exported = window.${globalNameFrom(name)};
    function init(){
      document.querySelectorAll('[data-component="${name}"]').forEach(function(el){
        try {
          if (typeof exported === 'function') exported(el);
        } catch(e){ console.error('init error for ${name}', e); }
      });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  }catch(e){}
})();
`;

  const finalJs = js + '\n' + wrapper;

  // Try to include a style block from the matching component HTML (if present)
  let styleBlock = '';
  try {
    const compHtmlPath = path.resolve('src/lib/components', name, 'index.html');
    if (fs.existsSync(compHtmlPath)) {
      const compHtml = fs.readFileSync(compHtmlPath, 'utf8');
      const m = compHtml.match(/<style\b([^>]*)>([\s\S]*?)<\/style>/i);
      if (m) {
        // If style block declares lang="csss", try to compile it to CSS using idae-csss
        const attrs = m[1] || '';
        const langMatch = attrs.match(/\blang\s*=\s*(?:"|')?([^"'\s>]+)/i);
        const lang = langMatch && langMatch[1] ? langMatch[1].toLowerCase() : null;
        let cssContent = m[2] || '';
        if (lang === 'csss') {
          try {
            const csssPath = path.resolve(__dirname, '..', '..', 'idae-csss', 'src', 'lib', 'index.js');
            if (fs.existsSync(csssPath)) {
              const csssMod = await import(pathToFileURL(csssPath).href);
              const compiler = csssMod.csss || csssMod.default || csssMod;
              if (typeof compiler === 'function') {
                const out = compiler(cssContent);
                if (typeof out === 'string' && out.trim()) cssContent = out;
              } else if (compiler && typeof compiler.compile === 'function') {
                const out = compiler.compile(cssContent);
                if (typeof out === 'string' && out.trim()) cssContent = out;
              }
            }
          } catch (e) { console.warn('csss compile failed for', compHtmlPath, e && e.message); }
        }
        // emit as plain CSS (drop lang attribute)
        styleBlock = `<style>${cssContent}</style>`;
      }
    }
  } catch (e) { /* ignore */ }

  // produce a minimal component HTML that contains the optional style and the script
  const html = `\n${styleBlock}\n<script>\n${finalJs}\n</script>\n`;

  fs.writeFileSync(outHtml, html, 'utf8');
  try { fs.unlinkSync(tmpFile); } catch(e){}
  console.log('Built', outHtml);
}

async function run(){
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const files = fs.readdirSync(moduleDir).filter(f => f.endsWith('.ts') || f.endsWith('.js'));
  for (const f of files) {
    const p = path.join(moduleDir, f);
    await buildOne(p);
  }
}

run().catch(err => { console.error(err); process.exit(1); });
