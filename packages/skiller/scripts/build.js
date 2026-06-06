// Build skiller into ./dist:
//   1. emit .d.ts declarations from the JSDoc-annotated ESM source (tsc)
//   2. copy the runtime verbatim (it is already valid ESM — no transpile needed)
//      including assets: registry.json, the skill/ tree, nested test CLIs.
// Publishing ships ./dist only (see package.json "files"), never raw src/.
import { execSync } from 'child_process';
import { cpSync, rmSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'src', 'lib');
const dist = path.join(root, 'dist');
const distLib = path.join(dist, 'lib');

rmSync(dist, { recursive: true, force: true });

// 1. declarations → dist/lib (rootDir=src preserves the lib/ segment, so the
//    runtime's `../../package.json` reads still resolve to the package root)
execSync('npx tsc -p tsconfig.json', { cwd: root, stdio: 'inherit' });

// 2. runtime + assets → dist/lib (merges alongside the emitted declarations)
cpSync(src, distLib, { recursive: true });

console.log('skiller: built ./dist (runtime + declarations)');
