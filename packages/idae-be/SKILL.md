---
name: idae-be-readme
package: '@medyll/idae-be'
description: Skill to dynamically retrieve the documentation (README.md) of the idae-be package via the standardized CLI. idae-be is a DOM walk and manipulation library with a callback-based approach for precise element targeting and consistent chaining. Useful for AI agents, automation scripts, or users needing up-to-date package docs.
---

# Skill: Read idae-be README

## Description
This skill allows you to access the full documentation of the idae-be package by using the CLI get-readme command. It is designed for use by AI agents, automation scripts, or any user who wants to quickly fetch the official package documentation.

## Usage

### Locally (in the monorepo):
```bash
npx @medyll/idae-be get-readme
```

### As an AI skill (VS Code, Claude, Copilot, etc.):
- Instruct the agent to run the above command to fetch the latest documentation.
- The output will be the content of the package's README.md.

## Integration Examples
- Automatic generation of contextual documentation
- Answering questions about the idae-be API or usage patterns
- Onboarding or contextual help in the editor

## Best Practices
- Always use the get-readme command to ensure the documentation is up to date (avoid static copies)
- Can be combined with other skills to explore the API, exports, or code examples of the package

## Limitations
- This skill only returns the content of README.md (not example files or detailed API docs)
- Requires the CLI to be properly exposed in package.json (bin field)
