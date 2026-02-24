// scripts/make-export.js (ESM)
// Génère un index.ts qui ré-exporte tous les composants Svelte d'un dossier
// Usage: node scripts/make-export.js

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';


// Racine des composants à traiter
const COMPONENT_ROOTS = [
  'src/lib/base',
  'src/lib/controls',
  'src/lib/data',
  'src/lib/navigation',
  'src/lib/ui',
];

// Glob patterns à exclure (ex: ['**/*.test.svelte', '**/demo*', ...])
const EXCLUDE_GLOBS = [
  '**/*.test*',
  '**/*.demo*',
  '**/*.preview*',
];

import { minimatch } from 'minimatch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getSvelteFiles(dir) {
  const entries = await fs.readdir(dir);
  // Exclure selon les patterns glob (sur nom ET chemin relatif)
  return entries.filter(f => {
    if (!f.endsWith('.svelte')) return false;
    // Chemin relatif depuis le dossier racine des composants
    const relPath = path.join(path.basename(dir), f);
    for (const pattern of EXCLUDE_GLOBS) {
      if (minimatch(f, pattern, { matchBase: true }) || minimatch(relPath, pattern)) return false;
    }
    return true;
  });
}

async function writeIndexFile(dir, files) {
  if (files.length === 0) return;
  // Si un seul composant, export classique groupé
  if (files.length === 1) {
    const name = path.basename(files[0], '.svelte');
    const importLine = `import ${name} from "./${name}.svelte";`;
    const exportLine = `export { ${name} };`;
    const content = importLine + '\n' + exportLine + '\n';
    await fs.writeFile(path.join(dir, 'index.ts'), content);
    return;
  }
  // Plusieurs composants : root = nom le plus court ou premier alpha
  const names = files.map(f => path.basename(f, '.svelte'));
  // Trouver le root : plus court, sinon premier alpha
  let rootName = names[0];
  for (const n of names) {
    if (n.length < rootName.length || (n.length === rootName.length && n < rootName)) {
      rootName = n;
    }
  }
  // Import root sous Root, les autres normalement
  const importLines = [];
  importLines.push(`import ${rootName}Root from "./${rootName}.svelte";`);
  const subNames = names.filter(n => n !== rootName);
  for (const n of subNames) {
    importLines.push(`import ${n} from "./${n}.svelte";`);
  }
  // Générer les propriétés de l'objet exporté
  // Convention : Item, Title, etc. = suffixe du nom (MenuListItem → Item)
  const objectProps = [`Root: ${rootName}Root`];
  for (const n of subNames) {
    // Extraire le suffixe après rootName, sinon garder le nom
    let prop = n.startsWith(rootName) ? n.slice(rootName.length) : n;
    if (!prop) prop = n; // fallback
    // Uppercase first letter
    prop = prop.charAt(0).toUpperCase() + prop.slice(1);
    objectProps.push(`${prop}: ${n}`);
  }
  const exportLine = `\nexport const ${rootName} = { ${objectProps.join(', ')} };\n`;
  const content = importLines.join('\n') + exportLine;
  await fs.writeFile(path.join(dir, 'index.ts'), content);
}

async function processDir(dir) {
  try {
    const stat = await fs.stat(dir);
    if (!stat.isDirectory()) return;
    const files = await getSvelteFiles(dir);
    if (files.length === 0) return;
    await writeIndexFile(dir, files);
  } catch (e) {
    // Ignore missing dirs
  }
}

export async function makeIndexFile() {
  // Générer index.ts racine de src/lib
  const libRoot = path.resolve(__dirname, '..', 'src/lib');
  const libExportLines = COMPONENT_ROOTS.map(root => {
    const name = path.basename(root);
    return `export * from './${name}/index.js';`;
  });
  const libContent = libExportLines.join('\n') + '\n';
  await fs.writeFile(path.join(libRoot, 'index.ts'), libContent);

  for (const root of COMPONENT_ROOTS) {
    const absRoot = path.resolve(__dirname, '..', root);
    let entries = [];
    try {
      entries = await fs.readdir(absRoot, { withFileTypes: true });
    } catch (e) {
      continue;
    }
    // Générer index.ts racine
    const exportLines = [];
    for (const d of entries) {
      if (d.isDirectory()) {
        // Exclure les dossiers selon les patterns glob
        let excluded = false;
        for (const pattern of EXCLUDE_GLOBS) {
          if (minimatch(d.name, pattern, { matchBase: true })) {
            excluded = true;
            break;
          }
        }
        if (!excluded) {
          await processDir(path.join(absRoot, d.name));
          exportLines.push(`export * from './${d.name}/index.js';`);
        }
      }
    }
    if (exportLines.length) {
      const content = exportLines.join('\n') + '\n';
      await fs.writeFile(path.join(absRoot, 'index.ts'), content);
    }
  }
  console.log('index.ts files generated for all component folders and roots.');
}

// Si exécuté en CLI, lance makeIndexFile()
if (import.meta.url === `file://${process.argv[1]}`) {
  makeIndexFile();
}
