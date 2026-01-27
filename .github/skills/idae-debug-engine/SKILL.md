---
name: idae-debug-engine
description: Advanced debugging orchestrator specialized in JS/TS stacks (Node.js, Vitest, React). Triggers on runtime errors or test commands. Prioritizes pnpm and modern tooling to isolate root causes and provide structured resolution paths.
metadata:
  author: Mydde
  version: "1.2"
compatibility: TypeScript, Vitest, Node.js, pnpm (preferred).
---

# IDAE Debug Engine

## Detection Logic
Trigger this skill when the user reports an issue or executes testing/dependency commands:
1. **Error Reports:** ReferenceError, TypeError, "it's broken", "not working", stack traces.
2. **Test Commands:** `pnpm test`, `pnpm run test`, `npx vitest`, `pnpm vitest`.
3. **Task Intent:** "debug this", "fix the failing test", "why is the build failing".
4. **Environment:** Detected use of `pnpm-lock.yaml`, Vitest configs, or TypeScript files.

## Core Methodology
Follow the **Trace-Isolate-Fix** protocol with a focus on pnpm environments:

1. **Trace Analysis:** Pinpoint the exact file, line, and column from the stack trace.
2. **Dependency Audit:** Check for peer dependency conflicts or missing packages (using `pnpm list`).
3. **Logic Isolation:** Suggest targeted testing using Vitest filters (`-t`) or `vi.each` to pinpoint data-driven failures.
4. **Resolution Path:** Provide code fixes and a validation command to ensure the fix works.

## Instructions
- **pnpm Preference:** Always suggest `pnpm` commands over npm/yarn.
- **Strict Typing:** Look for "as any" or missing type guards in TypeScript that might hide runtime bugs.
- **Async & Timers:** Specifically check for unawaited promises in Vitest suites or leaked timers.

## Example Output

**User:** "pnpm test" -> *Output shows: 1 failed, Auth Service > should hash password*

### 🔍 Debugging Session: `should hash password` failure

#### 1. Trace Diagnostics
- [ ] **Locate Failure:** Check if the error is a `Matcher error` (assertion failed) or a `Runtime error` (function threw).
- [ ] **Dependency Check:** Run `pnpm list bcrypt` or `argon2` to ensure native bindings are correctly linked.

#### 2. Isolation & Reproduction
- [ ] **Targeted Run:** Execute `pnpm vitest -t 'should hash password'`.
- [ ] **Mock Verification:** Ensure `vi.mock` is called at the top level and not inside a conditional block.
- [ ] **Console Inspection:** Use `console.dir(result, { depth: null })` to inspect complex objects.

#### 3. Common Resolutions
- **Vitest Setup:** Add `vi.clearAllMocks()` in `beforeEach` if state leaks between tests.
- **Environment Vars:** Ensure `.env.test` is loaded via `vitest` config.

## Edge Cases
- **Symlink Issues:** Being a pnpm user, check if `node_modules` symlinks are causing resolution issues in monorepos.
- **Zod Failures:** If using Zod, parse the `ZodError` to show exactly which field failed validation.
- **CI/CD Flakiness:** If it passes locally but fails in CI, check for architecture-specific dependencies (e.g., Linux vs macOS).