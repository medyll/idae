#!/usr/bin/env node
/**
 * Script de vérification des docs mal placées dans les composants Svelte
 * Cherche les blocs de texte/commentaires en début de fichier .svelte qui ne sont pas dans <script> ou <docs>
 */
const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '../src/lib');

function isSvelteFile(file) {
  return file.endsWith('.svelte');
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Cherche un bloc de commentaire ou texte avant le premier <script ou <docs
  const match = content.match(/^(\s*\/\*.*?\*\/|\s*\/\/.*|\s*[^<\s][^\n]*)/s);
  if (match && !content.startsWith('<script') && !content.startsWith('<docs')) {
    return true;
  }
  return false;
}

function scanDir(dir) {
  let flagged = [];
  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    if (fs.statSync(fullPath).isDirectory()) {
      flagged = flagged.concat(scanDir(fullPath));
    } else if (isSvelteFile(entry)) {
      if (scanFile(fullPath)) flagged.push(fullPath);
    }
  }
  return flagged;
}

const flaggedFiles = scanDir(SRC_DIR);
if (flaggedFiles.length) {
  console.log('Fichiers avec doc mal placée :');
  flaggedFiles.forEach(f => console.log(' -', f));
  process.exit(1);
} else {
  console.log('Aucune doc mal placée détectée.');
}
