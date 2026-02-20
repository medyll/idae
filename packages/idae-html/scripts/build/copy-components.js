import fs from 'fs';
import path from 'path';

const src = path.resolve('src/lib/components');
const dest = path.resolve('dist/components');

function copyDir(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const e of entries) {
    const srcPath = path.join(srcDir, e.name);
    const destPath = path.join(destDir, e.name);
    if (e.isDirectory()) copyDir(srcPath, destPath);
    else if (e.isFile()) fs.copyFileSync(srcPath, destPath);
  }
}

function run(){
  if (!fs.existsSync(src)) return console.log('No components to copy');
  copyDir(src, dest);
  console.log('Copied components to', dest);
}

run();
