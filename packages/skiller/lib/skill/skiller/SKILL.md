---
name: skiller
description: Use this when you need to create or install SKILL.md files for @medyll packages. Provides CLI commands to generate skill templates and install them to AI agent directories (Claude, Cursor, Codex, Windsurf, Zed, GitHub Copilot).
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

# Help
npx @medyll/skiller --help
npx @medyll/skiller create-skill --help
```

## Installation Targets

| Target | Location | Scope |
|--------|----------|-------|
| `user` | `~/.claude/skills/<pkg>/SKILL.md` | Global |
| `claude` | `./.claude/skills/<pkg>/SKILL.md` | Project |
| `codex` | `~/.codex/skills/<pkg>/SKILL.md` | Global |
| `agent` | `./.github/skills/<pkg>/SKILL.md` | Project |
| `cursor` | `~/.cursor/skills/<pkg>/SKILL.md` | Global |
| `windsurf` | `~/.windsurf/skills/<pkg>/SKILL.md` | Global |
| `zed` | `~/.zed/skills/<pkg>/SKILL.md` | Global |
| `custom` | User-specified path | Custom |

**Configuration file:** `packages/skiller/src/registry.json` — editable to add/remove targets.

## Library API

```ts
import { 
  findSkillMd,           // Find SKILL.md in a package
  findPackageJson,       // Find parent package.json
  getPackageName,        // Extract package name (without scope)
  createSkill,           // Create a SKILL.md template
  installSkill,          // Copy skill to destination
  interactivePrompt,     // Show interactive menu
  installSkillNonInteractive, // Install without prompts
  resolveTargetPath,     // Resolve a target path template
  getTargets             // Get available targets from registry
} from '@medyll/skiller';
```

### Examples

```ts
// Find SKILL.md in standard locations (auto-detects pkgName)
const skillPath = findSkillMd(pkgDir);
const skillPath = findSkillMd(pkgDir, 'my-pkg');

// Create a new skill template
createSkill({ pkgName: 'my-pkg', pkgDir, description: '...' });

// Install skill interactively
await interactivePrompt({ pkgName: 'my-pkg', skillSrc: skillPath });

// Install skill non-interactively
installSkillNonInteractive({ 
  pkgName: 'my-pkg', 
  skillSrc: skillPath, 
  target: 'user'  // or 'claude', 'cursor', 'codex', etc.
});

// Resolve a target path
const destDir = resolveTargetPath(['homedir', '.cursor', 'skills', '<pkg>'], 'my-pkg', process.cwd());

// Get all available targets
const targets = getTargets();
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

// Find SKILL.md in standard locations (pass pkgName for correct path resolution)
const skillSrc = findSkillMd(pkgDir, pkgName);

if (!skillSrc) {
  console.error(`No SKILL.md found for "${pkgName}"`);
  console.error('Searched: src/lib/skill/<pkg>/, dist/skill/<pkg>/, lib/skill/<pkg>/, package root');
  console.error(`Run "npx @medyll/skiller create-skill" in the package directory to create one.`);
  process.exit(1);
}

await interactivePrompt({ pkgName, skillSrc });
```

## SKILL.md Template Format

```markdown
---
name: <package-name>
description: <short description for AI agents>
---

## Overview
<Describe what the package does and when to use it>

## Install
```bash
pnpm add @medyll/<package-name>
```

## Core API
<List main functions, classes, and their signatures>

## Usage
```ts
// Code examples showing typical usage
```
```

## SKILL.md Search Paths

The CLI looks for `SKILL.md` in these locations (in order):

1. `src/lib/skill/<pkg>/SKILL.md` — Monorepo source (preferred)
2. `dist/skill/<pkg>/SKILL.md` — Built package
3. `lib/skill/<pkg>/SKILL.md` — Alternative location
4. `SKILL.md` — Package root (fallback)

## Usage Examples

### As a user installing a skill
```bash
# Navigate to package directory
cd node_modules/@medyll/qoolie

# Install the skill
npx @medyll/qoolie add-skill

# Choose target (e.g., 1 for user-wide Claude)
```

### As a package author creating a skill
```bash
# In your package directory
cd packages/my-package

# Create SKILL.md template
npx @medyll/skiller create-skill --name my-package --description "My awesome package"

# Edit the generated file
code lib/skill/my-package/SKILL.md

# Build your package (copies add-skill.js to dist)
npm run build

# Test the add-skill command
npx @medyll/my-package add-skill
```

### In a CI/CD pipeline
```bash
# Non-interactive installation
node -e "
  const { installSkillNonInteractive } = require('@medyll/skiller');
  installSkillNonInteractive({
    pkgName: 'my-pkg',
    skillSrc: './lib/skill/my-pkg/SKILL.md',
    target: 'user'
  });
"
```
