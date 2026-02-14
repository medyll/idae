import { build } from 'esbuild';
import fs from 'fs';
import path from 'path';

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
    globalName: 'resizePanelBundle',
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

  // Create a simple HTML component file
  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>resizePanel component</title>
</head>
<body>
  <!-- Usage: fetch this file and insert into DOM, or copy its <template> contents into your page -->
  <template id="idae-resizePanel-template">
    <div class="idae-resize-panel" data-resize-panel>
      <!-- panel content goes here -->
    </div>
  </template>

  <script>
${finalJs}
  </script>
</body>
</html>`;

  fs.writeFileSync(outHtml, html, 'utf8');
  // remove tmp file
  try { fs.unlinkSync(tmpFile); } catch(e){}

  console.log('Wrote', outHtml);
}

run().catch(err => { console.error(err); process.exit(1); });
