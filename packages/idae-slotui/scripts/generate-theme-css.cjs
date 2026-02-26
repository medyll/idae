#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const workspaceRoot = path.resolve(__dirname, '..');
const candidates = [
  path.join(workspaceRoot, 'sass', 'cssfabric.scss'),
  path.join(workspaceRoot, 'src', 'styles', 'cssfabric-theme.scss'),
];

function parseVars(content) {
  const vars = {};
  const re = /\$([a-zA-Z0-9_\-]+)\s*:\s*([^;]+);/g;
  let m;
  while ((m = re.exec(content))) {
    vars[m[1]] = m[2].trim();
  }
  return vars;
}

async function main() {
  const merged = {};
  for (const file of candidates) {
    try {
      const content = await fs.promises.readFile(file, 'utf8');
      const vars = parseVars(content);
      Object.assign(merged, vars);
    } catch (e) {
      // ignore missing files
    }
  }

  const primary = merged['theme-color-primary'] || '#00b5e2';
  const secondary = merged['theme-color-secondary'] || '#330c2f';
  const tertiary = merged['theme-color-tertiary'] || '#cacaaa';
  const darkForeground = merged['theme-dark-color-foreground'] || '#f1f1f1';
  const darkBackground = merged['theme-dark-color-background'] || '#27323a';
  const darkPaper = merged['theme-dark-color-paper'] || '#3a3b3b';

  const out = `:root {\n  --color-primary: ${primary};\n  --color-secondary: ${secondary};\n  --color-tertiary: ${tertiary};\n}\n\n.theme-dark {\n  --color-foreground: ${darkForeground};\n  --color-background: ${darkBackground};\n  --color-paper: ${darkPaper};\n}\n`;

  const outPath = path.join(workspaceRoot, 'src', 'styles', 'theme.css');
  await fs.promises.mkdir(path.dirname(outPath), { recursive: true });
  await fs.promises.writeFile(outPath, out, 'utf8');
  console.log('Wrote', outPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
