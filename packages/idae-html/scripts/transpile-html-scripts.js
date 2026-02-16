import fs from 'fs';
import path from 'path';
import { build } from 'esbuild';
import { pathToFileURL } from 'url';

const componentsDir = path.resolve('dist/components');

function walk(dir){
  if(!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).flatMap(f=>{
    const p = path.join(dir,f);
    if(fs.statSync(p).isDirectory()) return walk(p);
    return p.endsWith('.html') ? [p] : [];
  });
}

const repoRoot = path.resolve(process.cwd(), '..', '..');

function rewritePackageSpecifiers(code, htmlFile){
  // Convert imports from /packages/<pkg>/src/lib/... .ts -> relative path to <pkg>/dist/... .js
  return code.replace(/(from\s+['"]|import\s+['"])(\/packages\/[^'"\n]+?)\.ts(['"])/g,
    (m, prefix, spec, quote)=>{
      const m2 = spec.match(/^\/packages\/([^\/]+)\/src\/lib\/(.+)$/);
      if(m2){
        const pkg = m2[1];
        const relPath = m2[2];
        const targetAbs = path.join(repoRoot, 'packages', pkg, 'dist', relPath + '.js');
        if(fs.existsSync(targetAbs)){
          let relative = path.relative(path.dirname(htmlFile), targetAbs);
          if(!relative.startsWith('.')) relative = './' + relative;
          relative = relative.split(path.sep).join('/');
          return prefix + relative + quote;
        }
      }
      // fallback: simple .ts -> .js on the original absolute path
      return prefix + spec + '.js' + quote;
    }
  );
}

async function processFile(file){
  let html = fs.readFileSync(file,'utf8');

  const scriptRegex = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let match; let out = ''; let lastIndex = 0; let changed = false;

  while((match = scriptRegex.exec(html)) !== null){
    const [full, attrs, content] = match;
    const start = match.index; const end = scriptRegex.lastIndex;

    out += html.slice(lastIndex, start);

    const isModule = /type=\s*['"]module['"]/i.test(attrs) || /\bmodule\b/.test(attrs);
    const isTs = /lang=\s*['"]ts['"]/i.test(attrs) || /\btypescript\b/i.test(attrs) || /\.(ts|tsx)\b/.test(content);

    if(isModule && isTs){
      try{
        const code = rewritePackageSpecifiers(content, file);
        const esbuildOpts = {
          stdin: { contents: code, resolveDir: path.dirname(file), sourcefile: path.basename(file) + '_inline.ts', loader: 'ts' },
          // Do not bundle: keep imports as runtime imports to avoid inlining large
          // modules like core-engine into every inline script.
          bundle: false,
          format: 'esm',
          platform: 'browser',
          target: ['es2020'],
          write: false,
          sourcemap: false,
          loader: { '.ts': 'ts', '.tsx': 'tsx' }
        };
        // only set externals when bundling (esbuild rejects `external` with bundle:false)
        if(esbuildOpts.bundle){
          esbuildOpts.external = ['@medyll/*'];
        }
        const result = await build(esbuildOpts);
        const js = result.outputFiles && result.outputFiles[0] && result.outputFiles[0].text || '';
        out += `<script type="module">\n${js}\n</script>`;
        changed = true;
      }catch(e){
        console.error('esbuild error for', file, e);
        // fallback: keep original
        out += full;
      }
    }else{
      out += full;
    }

    lastIndex = end;
  }

  out += html.slice(lastIndex);

  if(changed) fs.writeFileSync(file, out, 'utf8');
}

async function run(){
  const files = walk(componentsDir);
  for(const f of files){
    // only process if file contains ts script or lang=ts
    const c = fs.readFileSync(f,'utf8');
    if(/<script[^>]*lang=\s*['"]ts['"]/i.test(c) || /import\s+[^;]*\.ts['"]/i.test(c) || /from\s+['"][^'\"]+\.ts['"]/i.test(c)){
      console.log('Transpiling scripts in', f);
      await processFile(f);
    }
  }
}

run().catch(err=>{ console.error(err); process.exit(1); });
