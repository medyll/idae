---
name: readme-creator
description:  Skill to create a README.md file for any project where it stands.
---

# Skill: README File Creator (Total Style)

## Overview
This skill enables an AI agent to generate comprehensive, high-quality README.md files for any project. The agent deeply analyzes the codebase, infers architecture, usage, and conventions, and produces a README that is both informative and inviting for new contributors or users.

## Capabilities
- **Codebase Exploration**: Scans all source files, tests, configs, and scripts to extract key information.
- **Architecture Inference**: Summarizes major modules, data flows, and design patterns.
- **Usage Extraction**: Detects and documents public APIs, CLI commands, and integration points.
- **Workflow Documentation**: Lists build, test, and development commands, including non-obvious scripts.
- **Convention Highlighting**: Notes project-specific patterns, naming, and best practices.
- **Example Generation**: Provides code snippets and usage examples from real code.
- **Contribution Guidance**: Outlines how to contribute, run tests, and report issues.
- **License & Credits**: Detects and documents licensing and authorship.

## Usage
- Invoke this skill to generate or update a README.md for any repository.
- The agent will:
  1. Analyze all relevant files (source, test, config, docs).
  2. Synthesize a clear, well-structured README in markdown.
  3. Include sections such as: Project Overview, Features, Installation, Usage, API, Developer Workflows, Contributing, License, and References.
  4. Use real code and config examples from the project.

## Example Output
- See the generated [README.md](../../../../README.md) in this repository for a sample.

## References
- Main logic: See `src/` for code analysis routines.
- Example templates: See `README.md` and `.github/copilot-instructions.md`.

---
This skill is ideal for onboarding, documentation automation, and ensuring every project is easy to understand and use.
