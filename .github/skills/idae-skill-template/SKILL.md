---
name: idae-skill-template
description: 'Create, optimize, update, scaffold, or analyze Agent Skills for GitHub Copilot from prompts or by duplicating this template. Use when asked to "create a skill", "make a new skill", "scaffold a skill", "analyze a skill", or when building, reviewing, or improving specialized AI capabilities with bundled resources. Also use when asked to update, optimize, improve, or analyze an existing skill. Generates SKILL.md files with proper frontmatter, directory structure, and optional scripts/references/assets folders.'
metadata:
  author: Mydde
  version: "1.1"
---

# Make Skill Template

A meta-skill for creating, optimizing, updating, or analyzing Agent Skills.

**CRITICAL INSTRUCTION**: If provided with a skill file to "analyze", "review", or "audit", DO NOT summarize or describe the content. You must maintain your role as a generator/auditor and output a **Technical Action Plan** (roadmap) to improve, fix, or validate that skill.

## When to Use This Skill

- User asks to "create a skill", "make a new skill", "scaffold a skill", or "update a skill"
- User veut mettre à jour, optimiser, améliorer, ou analyser une skill existante
- User wants to add a specialized capability to their GitHub Copilot setup
- User needs help structuring a skill with bundled resources
- User wants to duplicate this template as a starting point
- User asks to "analyze a skill", "review a skill", or requests a skill audit

## Prerequisites

- Understanding of what the skill should accomplish
- A clear, keyword-rich description of capabilities and triggers
- Knowledge of any bundled resources needed (scripts, references, assets, templates)

## Core Behavior Rules

- **No Meta-Analysis:** Do not summarize the provided skill. Focus exclusively on actionable tasks.
- **Action-Oriented:** Always use a phased approach with checkboxes `[ ]`.
- **Imperative Mood:** Use verbs like "Refactor", "Update", "Validate".

## Creating or Updating a Skill

### Step 1: Create or Locate the Skill Directory

Create a new folder with a lowercase, hyphenated name:

```

skills/<skill-name>/
└── SKILL.md          # Required

```

### Step 2: Generate or Update SKILL.md with Frontmatter

Every skill requires YAML frontmatter with `name` and `description`. When updating, ensure these fields are current and reflect any new capabilities or triggers:

```yaml
---
name: <skill-name>
description: "<What it does>. Use when <specific triggers, scenarios, keywords users might say>."
---
```

#### Frontmatter Field Requirements

| Field           | Required | Constraints                                                                |
| --------------- | -------- | -------------------------------------------------------------------------- |
| `name`          | **Yes**  | 1-64 chars, lowercase letters/numbers/hyphens only, must match folder name |
| `description`   | **Yes**  | 1-1024 chars, must describe WHAT it does AND WHEN to use it                |
| `license`       | No       | License name or reference to bundled LICENSE.txt                           |
| `compatibility` | No       | 1-500 chars, environment requirements if needed                            |
| `metadata`      | No       | Key-value pairs for additional properties                                  |
| `allowed-tools` | No       | Space-delimited list of pre-approved tools (experimental)                  |

#### Description Best Practices

**CRITICAL**: The `description` is the PRIMARY mechanism for automatic skill discovery. Include:

1. **WHAT** the skill does (capabilities)
2. **WHEN** to use it (triggers, scenarios, file types)
3. **Keywords** users might mention in prompts

**Good example:**
`description: 'Toolkit for testing local web applications using Playwright. Use when asked to verify frontend functionality, debug UI behavior, capture browser screenshots, or view browser console logs.'`

### Step 3: Write or Update the Skill Body

After the frontmatter, add or update markdown instructions. Recommended sections:

| Section                     | Purpose                         |
| --------------------------- | ------------------------------- |
| `# Title`                   | Brief overview                  |
| `## When to Use This Skill` | Reinforces description triggers |
| `## Step-by-Step Workflows` | Numbered steps for tasks        |
| `## Troubleshooting`        | Common issues and solutions     |

### Step 4: Add or Update Optional Directories (If Needed)

| Folder        | Purpose                            | When to Use                         |
| ------------- | ---------------------------------- | ----------------------------------- |
| `scripts/`    | Executable code (Python, Bash, JS) | Automation that performs operations |
| `references/` | Documentation agent reads          | API references, schemas, guides     |
| `assets/`     | Static files used AS-IS            | Images, fonts, templates            |

## Quick Start: Duplicate or Update This Template

1. To create: Copy the `make-skill-template/` folder
2. Rename to your skill name (lowercase, hyphens)
3. Update `SKILL.md`:

- Change `name:` to match folder name
- Write a keyword-rich `description:`

4. To update: Edit the existing `SKILL.md` to reflect new capabilities.

## Validation Checklist (Mandatory for Audits)

- [ ] Folder name and `name` field match exactly (lowercase-hyphenated).
- [ ] `description` is 10-1024 characters and wrapped in single quotes.
- [ ] Logic includes specific edge cases and avoids conversational fluff.

## Troubleshooting

| Issue                    | Solution                                                 |
| ------------------------ | -------------------------------------------------------- |
| Skill not discovered     | Improve description with more keywords and triggers      |
| Validation fails on name | Ensure lowercase, no consecutive hyphens, matches folder |
| Skill summarizes itself  | Verify the "Zero Meta-Description" rule in the body      |

## References

- Agent Skills official spec: [https://agentskills.io/specification](https://agentskills.io/specification)
