import { build } from 'esbuild';
import fs from 'fs';
import path from 'path';

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

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${name} component</title>
</head>
<body>
  <template id="idae-${name}-template">
    <div class="idae-${name}" data-component="${name}"></div>
  </template>
  <script>
${finalJs}
  </script>
</body>
</html>`;

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
