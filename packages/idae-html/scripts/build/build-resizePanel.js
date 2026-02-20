import { build } from 'esbuild';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

async function run() {
  const entry = path.resolve('src/lib/moduleLib/resizePanel.ts');
  const outDir = path.resolve('dist');
  const outFile = path.join(outDir, 'resizePanel.mjs');

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  console.log('Bundling', entry, '→', outFile);
  await build({
    entryPoints: [entry],
    outfile: outFile,
    bundle: false,
    sourcemap: true,
    format: 'esm',
    target: ['es2020'],
    platform: 'browser'
  });

  // Emit TypeScript declaration for the single file
  try {
    console.log('Emitting declaration for', entry);
    execSync(`npx tsc "${entry}" --declaration --emitDeclarationOnly --outDir "${outDir}" --module ES2020`, { stdio: 'inherit' });
  } catch (e) {
    console.warn('tsc declaration generation failed:', e.message);
  }

  console.log('Done. Output in', outDir);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
