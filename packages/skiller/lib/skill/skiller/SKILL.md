---
name: skiller
description: "Guide for the @medyll/skiller CLI and npm library: create SKILL.md templates for @medyll packages, install skills to multiple AI editor targets (Claude, Cursor, Codex, Windsurf, Zed), run multi-model evaluations (Claude, Qwen, Ollama, OpenAI) via test-suite.json, generate HTML reports, and AI-optimize skills. Use this skill whenever the user mentions `npx @medyll/skiller`, installing a skill to an editor target, running skill tests across models, or creating skill templates for @medyll packages. This is NOT for validating skill frontmatter (use skill-master) or authoring Claude Code skills from scratch (use skill-creator)."
---

## Overview

`@medyll/skiller` is an npm CLI + library for the full lifecycle of SKILL.md files in @medyll packages: template creation, multi-target installation, multi-model evaluation, HTML reporting, and AI-powered optimization.

## When to use skiller vs other skills

| You want to... | Use |
|---|---|
| Create a SKILL.md template for an @medyll package | **skiller** (`npx @medyll/skiller create-skill`) |
| Install a skill to Claude/Cursor/Codex/Windsurf/Zed | **skiller** (`npx @medyll/skiller add-skill`) |
| Run multi-model tests on a skill (Claude, Qwen, Ollama) | **skiller** (`npx @medyll/skiller test-skill`) |
| View HTML test reports | **skiller** (`npx @medyll/skiller report`) |
| AI-optimize a skill based on test failures | **skiller** (`npx @medyll/skiller optimize`) |
| Validate/repair SKILL.md frontmatter structure | **skill-master** |
| Author a new Claude Code skill from scratch with eval loops | **skill-creator** |

## Install

```bash
pnpm add @medyll/skiller
```

## CLI Commands

### create-skill — Generate a SKILL.md template
```bash
npx @medyll/skiller create-skill --name my-package --description "My package description"
```
Creates `lib/skill/<pkg>/SKILL.md` and optionally `test-suite.json`.

### add-skill — Install a skill to an editor target
```bash
npx @medyll/skiller add-skill
```
Interactive prompt to choose a target. Non-interactive: `npx @medyll/skiller add-skill --target user`.

### test-skill — Run multi-model evaluations
```bash
npx @medyll/skiller test-skill              # All configured models
npx @medyll/skiller test-skill --model claude  # Specific model
npx @medyll/skiller test-skill --parallel      # Parallel execution
```

### report — View HTML test results
```bash
npx @medyll/skiller report                        # Latest report
npx @medyll/skiller report --session 20260331-194500  # Specific session
```

### optimize — AI-powered skill optimization
```bash
npx @medyll/skiller optimize --skill my-package
npx @medyll/skiller optimize --skill my-package --dry-run  # Preview suggestions
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

Configuration: `packages/skiller/src/registry.json`.

## test-suite.json Format

```json
{
  "name": "my-skill",
  "models": [
    { "name": "claude", "adapter": "claude" },
    { "name": "qwen", "adapter": "qwen", "model": "qwen-turbo" },
    { "name": "ollama", "adapter": "ollama", "model": "llama3" }
  ],
  "cases": [
    {
      "id": "case-001",
      "name": "Basic usage test",
      "input": "User prompt to test against the skill",
      "assertions": {
        "min_length": 100,
        "max_length": 5000,
        "format": "markdown",
        "required_keywords": ["import", "function"],
        "forbidden_keywords": ["deprecated"],
        "contains_code": true
      }
    }
  ]
}
```

**Assertion types:** `min_length`, `max_length`, `format` (markdown|json|code), `required_keywords`, `forbidden_keywords`, `contains_code`.

## SKILL.md Template

```markdown
---
name: <package-name>
description: <When to trigger + what it does. Be specific and include trigger phrases.>
---

## Overview
What the package does, when and why to use it.

## Install
\`\`\`bash
pnpm add @medyll/<package-name>
\`\`\`

## Core API
Main functions, classes, signatures with brief descriptions.

## Usage
Realistic code examples showing typical workflows.

## References
Point to references/ files for advanced API docs, integration guides, etc.
```

## References

For detailed documentation, read these files from `references/`:
- **`references/api-reference.md`** — Full library API exports and usage examples
- **`references/integration-guide.md`** — How to add `add-skill` to your package, CI/CD setup
- **`references/search-paths.md`** — SKILL.md lookup order and usage examples
