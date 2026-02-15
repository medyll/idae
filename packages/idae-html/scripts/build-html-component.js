import { build } from 'esbuild';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

async function run() {
  const entry = path.resolve('src/lib/moduleLib/resizePanel.ts');
  const outDir = path.resolve('dist');
  const tmpFile = path.join(outDir, 'resizePanel.tmp.js');
  const outHtml = path.join(outDir, 'resizePanel.html');

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // Bundle to a temporary IIFE JS file
  await build({
    entryPoints: [entry],
    outfile: tmpFile,
    bundle: true,
    format: 'iife',
    globalName: 'resizePanel',
    platform: 'browser',
    minify: true,
    sourcemap: false,
    target: ['es2020']
  });

  const js = fs.readFileSync(tmpFile, 'utf8');

  // Wrap the exported function into a small initializer that attaches to elements with data-resize-panel
  const wrapper = `
// Auto-initializer: looks for [data-resize-panel] and applies resizePanel
(function(){
  var resizePanel = window.resizePanel || (this && this.resizePanel);
  // If module bundled assigned to global, try to find function
  if (!resizePanel) {
    // try to evaluate bundle which may expose function as resizePanel
  }
  function init() {
    try {
      document.querySelectorAll('[data-resize-panel]').forEach(function(el){
        try { if (typeof resizePanel === 'function') resizePanel(el); }
        catch(e){ console.error('resizePanel init error', e); }
      });
    } catch(e) { /* ignore */ }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
`;

  const finalJs = js + '\n' + wrapper;
  // Try to include a style block from the matching component HTML (if present)
  let styleBlock = '';
  try {
    const compHtmlPath = path.resolve('src/lib/components', 'resizePanel', 'index.html');
    if (fs.existsSync(compHtmlPath)) {
      const compHtml = fs.readFileSync(compHtmlPath, 'utf8');
      const m = compHtml.match(/<style\b([^>]*)>([\s\S]*?)<\/style>/i);
      if (m) {
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
        styleBlock = `<style>${cssContent}</style>`;
      }
    }
  } catch (e) { /* ignore */ }

  // Create a minimal HTML component file containing optional style and the script
  const html = `\n${styleBlock}\n<script>\n${finalJs}\n</script>\n`;

  fs.writeFileSync(outHtml, html, 'utf8');
  // remove tmp file
  try { fs.unlinkSync(tmpFile); } catch(e){}

  console.log('Wrote', outHtml);
}

run().catch(err => { console.error(err); process.exit(1); });
