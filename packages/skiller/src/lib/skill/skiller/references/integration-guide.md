# @medyll/skiller — Package Integration Guide

## Adding add-skill to your package

Add to your package's `package.json`:
```json
{
  "bin": {
    "add-skill": "./dist/cli/add-skill.js"
  },
  "dependencies": {
    "@medyll/skiller": "workspace:*"
  }
}
```

Create `dist/cli/add-skill.js`:
```js
#!/usr/bin/env node
import { findSkillMd, interactivePrompt, getPackageName, findPackageJson } from '@medyll/skiller';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve package directory (dist/cli -> dist -> package root)
const distDir = path.resolve(__dirname, '..');
const pkgDir = path.resolve(distDir, '..');

// Find package.json to get the actual package name
const pkgJsonPath = findPackageJson(pkgDir);
const pkgName = pkgJsonPath ? getPackageName(pkgJsonPath) : 'unknown';

// Find SKILL.md in standard locations
const skillSrc = findSkillMd(pkgDir, pkgName);

if (!skillSrc) {
  console.error(`No SKILL.md found for "${pkgName}"`);
  console.error('Searched: src/lib/skill/<pkg>/, dist/skill/<pkg>/, lib/skill/<pkg>/, package root');
  console.error(`Run "npx @medyll/skiller create-skill" in the package directory to create one.`);
  process.exit(1);
}

await interactivePrompt({ pkgName, skillSrc });
```

## CI/CD Non-Interactive Installation

```bash
node -e "
  const { installSkillNonInteractive } = require('@medyll/skiller');
  installSkillNonInteractive({
    pkgName: 'my-pkg',
    skillSrc: './lib/skill/my-pkg/SKILL.md',
    target: 'user'
  });
"
```
