---
name: idae-be-readme
package: '@medyll/idae-be'
description: Skill to dynamically retrieve the documentation (README.md) of the idae-be package via the standardized CLI. idae-be is a DOM walk and manipulation library with a callback-based approach for precise element targeting and consistent chaining. Useful for AI agents, automation scripts, or users needing up-to-date package docs.
---
name: idae-be-readme
package: '@medyll/idae-be'
description: Instantly fetch the latest idae-be documentation (README.md) via CLI or AI agent integration. For automation, onboarding, and up-to-date usage help.
---

# idae-be-readme Skill

**Summary:** Retrieve the most current idae-be documentation (README.md) using a single CLI command or via AI agent integration. Ideal for automation, onboarding, and contextual help.

## Description
This skill provides instant access to the official documentation of the idae-be package. It leverages the standardized CLI to always return the latest README.md, ensuring up-to-date information for developers, AI agents, and automation scripts.

## Usage

**From the monorepo:**
```bash
npx @medyll/idae-be get-readme
```

**From an AI agent (VS Code, Claude, Copilot, etc.):**
- Instruct the agent to run the above command to fetch the latest documentation.
- The output will be the content of the package's README.md.

## Integration Examples
- Auto-generate contextual documentation in editors or bots
- Answer questions about idae-be API or usage
- Provide onboarding or contextual help

## Best Practices
- Always use the CLI command to ensure documentation is current (avoid static/manual copies)
- Combine with other skills to explore API, exports, or code examples

## Limitations
- Only returns README.md (not example files or detailed API docs)
- Requires the CLI to be exposed in package.json (bin field)

## Compatibility
- Works in monorepo, with any agent or automation that can run CLI commands
