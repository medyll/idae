---
name: skiller
description: Use this when you need to create or install SKILL.md files for @medyll packages. Provides CLI commands to generate skill templates and install them to AI agent directories (Claude, Codex, GitHub Copilot).
---

## Overview
Skill installer and creator for @medyll packages. Creates SKILL.md templates and installs them to AI agent skill directories.

## Install
```bash
pnpm add @medyll/skiller
```

## CLI Commands

### Create a new skill template
```bash
# In a package directory
npx @medyll/skiller create-skill

# With options
npx @medyll/skiller create-skill --name my-package --description "My package description"
```

### Install a skill
```bash
# Interactive mode (default)
npx @medyll/skiller add-skill

# Or from any @medyll package that has add-skill bin
npx @medyll/<package> add-skill
```

## Installation Targets

| Target | Location |
|--------|----------|
| user | `~/.claude/skills/<pkg>/SKILL.md` |
| claude | `./.claude/skills/<pkg>/SKILL.md` (current project) |
| codex | `~/.codex/skills/<pkg>/SKILL.md` |
| agent | `./.github/skills/<pkg>/SKILL.md` (current project) |
| custom | User-specified path |

## Library API

```ts
import { findSkillMd, installSkill, createSkill, interactivePrompt } from '@medyll/skiller';

// Find SKILL.md in standard locations
const skillPath = findSkillMd(pkgDir);

// Create a new skill template
createSkill({ pkgName: 'my-pkg', pkgDir, description: '...' });

// Install skill interactively
await interactivePrompt({ pkgName: 'my-pkg', skillSrc: skillPath });
```

## Package Integration

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
import { findSkillMd, interactivePrompt } from '@medyll/skiller';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkgDir = path.resolve(__dirname, '../..');

const skillSrc = findSkillMd(pkgDir);
if (!skillSrc) {
  console.error('No SKILL.md found');
  process.exit(1);
}

await interactivePrompt({ pkgName: 'your-package', skillSrc });
```
