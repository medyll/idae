---
name: idae-api-readme
package: '@medyll/idae-api'
description: Skill to dynamically retrieve the documentation (README.md) of the idae-api package via the standardized CLI. idae-api is a modular Node.js API framework supporting multiple database types (MongoDB, MySQL, etc.), TypeScript client, and MongoDB-like query syntax. Useful for AI agents, automation scripts, or users needing up-to-date package docs.
---

# Skill: Read idae-api README

## Description
This skill allows you to access the full documentation of the idae-api package by using the CLI get-readme command. It is designed for use by AI agents, automation scripts, or any user who wants to quickly fetch the official package documentation.

## Usage

### Locally (in the monorepo):
```bash
npx @medyll/idae-api get-readme
```

### As an AI skill (VS Code, Claude, Copilot, etc.):
- Instruct the agent to run the above command to fetch the latest documentation.
- The output will be the content of the package's README.md.

## Integration Examples
- Automatic generation of contextual documentation
- Answering questions about the idae-api endpoints, configuration, or usage patterns
- Onboarding or contextual help in the editor

## Best Practices
- Always use the get-readme command to ensure the documentation is up to date (avoid static copies)
- Can be combined with other skills to explore the API, exports, or code examples of the package

## Limitations
- This skill only returns the content of README.md (not example files or detailed API docs)
- Requires the CLI to be properly exposed in package.json (bin field)
