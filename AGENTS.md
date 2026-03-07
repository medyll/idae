# AGENTS.md

This document provides guidelines for AI agents operating inside the Idae monorepo. It covers build/test commands, code style, error handling, and how to work with the Nx/pnpm-based workflow.

Build, Lint, Test Commands

- Root setup
  - pnpm install
  - pnpm run package
  - pnpm run lint
  - pnpm run format
  - pnpm run check

- Per-package commands (scope with --filter <pkg> or use Nx)
  - Build: pnpm --filter <pkg> run build
  - Lint: pnpm --filter <pkg> run lint
  - Test: pnpm --filter <pkg> run test
  - Unit tests: pnpm --filter <pkg> run test:unit
  - Integration tests: pnpm --filter <pkg> run test:integration
  - Type checks: pnpm --filter <pkg> run check
  - Nx equivalents: nx run <project>:build, nx run <project>:test, nx graph

- Running a single test
  - Vitest-based unit tests: pnpm --filter <pkg> test:unit -- -t "<test name>"
  - Example: pnpm --filter idae-slotui test:unit -- -t 'renders a Button'
  - Playwright-based integration: pnpm --filter <pkg> run test:integration -- --testPath=tests/path/to/spec.ts

- Running a single test in a specific file with Vitest
  - Use --testNamePattern or -t (depends on Vitest version):
    - pnpm --filter <pkg> test:unit -- --testNamePattern="My test pattern"

- Quick tips
  - Use --filter to limit the scope to the package you are editing to speed up feedback loops.
  - When in doubt, use nx for orchestration: nx graph, nx run <project>:test --watch

- Node: Some packages use Playwright for e2e; keep in mind: Playwright might need the browser installed.

- Nx Commands
  - nx run <project>:build
  - nx run <project>:test
  - nx graph

Code Style Guidelines

- General
  - Follow the repository's Prettier config; respect line length and semicolon usage per project.
  - Enable strict TypeScript checks; prefer explicit types where possible.
  - Use workspace imports (e.g., import { Foo } from '@medyll/foo') instead of deep relative paths when feasible.
  - Do not import from dist/; import from package source exports.

- Imports
  - Order: builtin, external, internal; separate groups with a blank line.
  - Favor absolute imports; minimize deep relative imports.
  - Use type-only imports where possible to reduce runtime cost: import type { X } from 'pkg'
  - Avoid circular dependencies; prefer dependency graph analysis with nx graph.

- Types & Interfaces
  - Prefer interfaces for public APIs, and type aliases for complex unions.
  - Export types alongside runtime values when it clarifies usage.
  - Prefer readonly where immutability makes sense.

- Naming conventions
  - Variables and functions: camelCase
  - Classes, components, and enums: PascalCase
  - Constants: ALL_CAPS_SNAKE
  - File naming: PascalCase for components (e.g., MyWidget.svelte)
  - Prefix interfaces with I (optional, align with project style)

- Formatting
  - Use Prettier with the repo's shared config; avoid reformatting beyond project scope unless requested.
  - End files with a newline; 2-space or 4-space indentation is governed by Prettier config; keep consistent with project norms.
  - Avoid long lines; prefer semantically split lines with meaningful breaks.

- Error handling
  - Do not swallow errors; add context when rethrowing.
  - Use application-specific error classes (e.g., AppError) with HTTP status when applicable.
  - Prefer explicit error messages and error propagation rather than console.error in production paths.

- Async patterns
  - Always await promises; use Promise.all for parallelism when independent.
  - Handle cancellations where supported; ensure cleanup of resources.

- Tests
  - Use descriptive test names; follow describe/it patterns.
  - Vitest/Jest: explicit test names; avoid relying on file names alone.
  - Playwright: clear user flows and assertions; avoid flaky selectors.

- Documentation & comments
  - JSDoc for exported APIs; inline comments only when logic is non-obvious.
  - Document data contracts and error formats where relevant.

- Cursor rules
  - Cursor rules exist under .cursor/rules/ or .cursorrules.
  - Agents editing or navigating the repo should respect these rules to minimize conflicts.
  - If cursor rules are missing, consider adding lightweight cursor guidelines to the repo's docs.

- Copilot rules
  - Copilot guidance is defined in .github/copilot-instructions.md.
  - Agents should consult it before proposing significant edits.

Project-specific guidance

- Idae monorepo uses pnpm workspaces, Nx, and Lerna for orchestration.
- Use nx run for project tasks when available; otherwise fall back to pnpm with --filter.
- Always run lint and type checks before committing code in Svelte packages.
- Ensure unit tests run locally and pass before proposing changes.

Review & PR guidance

- Before submitting PRs, run: pnpm run lint && pnpm run check && pnpm run test
- Prefer descriptive, context-first commit messages.
- If pushing, ensure you are on a feature branch and push to origin.

Environment & tooling

- Node.js version: use Node >= 18; ensure compatibility with Nx and pnpm workspaces.
- Package manager: pnpm; use pnpm install, pnpm run, pnpm add, etc.
- Editor tooling: adhere to project ESLint/Prettier settings; run npm run check before commits.

Next steps

- If you make edits, run lint, tests, and builds locally to verify.
- Consider adding examples for single-test patterns and Nx-based workflows.
- Propose AGENTS.md improvements in a follow-up PR.
