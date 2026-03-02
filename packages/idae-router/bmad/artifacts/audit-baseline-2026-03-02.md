# 🔍 Audit Report: idae-router

**Date:** 2026-03-02  
**Package:** @medyll/idae-router (SvelteKit router library)  
**Scope:** Full codebase audit (code quality, testing, packaging, dependencies)

---

## 1. Code Quality ✅ / ⚠️

### Source Structure
- **7 core modules** in `src/lib/`:
  - `router.ts` (234 lines) — Main orchestrator
  - `matcher.ts` (90 lines) — Path compilation & URL parsing
  - `render.ts` (33 lines) — DOM mounting logic
  - `types.ts` (60 lines) — Comprehensive type exports
  - `index.ts` — Public API re-exports

### TypeScript Usage ✅
- Strict mode enabled (`"strict": true`)
- Full type coverage for all public APIs
- Well-defined interfaces: `Route`, `Context`, `RouterInstance`, `RouteRecord`
- Generic action results: `ActionResult` union supports multiple return types

### Code Patterns ✅
- Functional, composable design
- Pure utility functions
- Async-first with hook system
- Nested route tree traversal is solid

### ⚠️ Minor Issues
- **XSS Risk (HIGH):** `innerHTML` direct assignment in `render.ts:12` — if user supplies untrusted HTML/scripts, they execute
- **Error Handling:** Silenced `.catch()` blocks (lines 161, 172) mask real navigation failures

---

## 2. Testing ✅ / ⚠️

### Unit Tests (Vitest)
| File | Tests | Status |
|------|-------|--------|
| matcher.test.ts | 3 | ✅ Param compilation, wildcards, query parsing |
| router.test.ts | 4 | ✅ String rendering, cleanup, before hooks, nesting |
| demo.spec.ts | 1 | ❌ Dummy test (1+2=3) — should remove |

### E2E Tests (Playwright)
| File | Tests | Status |
|------|-------|--------|
| demo.test.ts | 4 | ✅ Navigation, async content, link interception, nesting |

### Coverage Assessment
- ✅ Core paths tested: navigation, hooks, cleanup, route nesting
- ⚠️ **Missing:** Hash mode (only history), error states, 404 behavior, concurrent nav, link edge cases
- ⚠️ **No coverage reports** — vitest has no `--coverage` config
- ⚠️ `demo.spec.ts` clutters results; remove

---

## 3. Documentation ✅ / ⚠️

### README.md
- ✅ Complex example with async, cleanup, nested routes
- ✅ Usage guide & behavior notes
- ⚠️ No API reference (signatures for `router.push()`, `router.before()`, etc.)
- ⚠️ No TypeScript examples (only vanilla JS)
- ⚠️ Missing: error handling, advanced patterns

### SPECS.md
- ✅ Detailed context object schema & lifecycle hooks
- ✅ Route matching engine specs
- ⚠️ Some specs not fully implemented ("sequential or parallel" — currently sequential only)

### Inline Documentation
- ⚠️ Minimal JSDoc comments
- ⚠️ No module-level architecture docs

---

## 4. Build & Packaging ✅ / ⚠️

### Vite Config ✅
- SvelteKit plugin integrated
- Vitest: jsdom + node environments
- `expect.requireAssertions: true` enforces assertions

### Svelte Package Setup ✅
- `svelte-package` integrated via prepack script
- `publint` validates on build
- Outputs to `dist/` with `.d.ts` type definitions

### Exports Configuration ⚠️
```json
{
  "svelte": "./dist/index.js",
  "types": "./dist/index.d.ts"
}
```
- ✅ Correct Svelte field + types
- ❌ **Missing CommonJS default:** No `"main"` field → CJS consumers fail
- ⚠️ **Tests in dist/:** Despite `files` field exclusion, test files appear in dist output

**Recommendations:**
```json
{
  "main": "./dist/index.js",
  "svelte": "./dist/index.js",
  "types": "./dist/index.d.ts"
}
```

---

## 5. Dependencies ✅

### Peer Dependencies
- `svelte: ^5.0.0` ✅ Current (5.49.2)
- No external runtime deps ✅ (lightweight as intended)

### DevDependencies ✅
- Latest: SvelteKit 2.50.2, Svelte 5.49.2, TypeScript 5.9.3
- ESLint + TypeScript plugin for strict linting
- Prettier + Svelte formatter
- Vitest + Playwright for complete test coverage
- `publint` for package validation

---

## 6. Critical Issues 🚨

| Issue | Severity | Impact |
|-------|----------|--------|
| **XSS via innerHTML** | **CRITICAL** | Untrusted HTML strings execute scripts |
| **Test files in dist/** | **MEDIUM** | npm package polluted with `.test.js`, `.spec.js` |
| **No CommonJS export** | **MEDIUM** | Breaks CJS/require environments |
| **Silenced Promise.catch()** | **MEDIUM** | Masks real navigation errors |
| **demo.spec.ts dummy** | **LOW** | Noise in test suite |

---

## 7. Priority Fixes (Top 3)

### 🔴 #1: Sanitize innerHTML (2h)
**File:** `src/lib/render.ts:12`

**Issue:** Direct `innerHTML` assignment allows XSS if route actions return untrusted HTML.

**Fix:**
```typescript
// BEFORE:
outlet.innerHTML = result;

// AFTER (for plain text):
outlet.textContent = result;

// OR (for sanitized HTML):
import DOMPurify from 'dompurify';
outlet.innerHTML = DOMPurify.sanitize(result);
```

**Impact:** Eliminates XSS vector; hardens security posture.

---

### 🟡 #2: Fix Package Exports & Build Output (1h)
**Files:** `package.json`, `svelte.config.js`

**Issues:**
1. Missing CommonJS default export
2. Test files included in dist/

**Fix:**
```json
{
  "main": "./dist/index.js",
  "svelte": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": ["dist", "!dist/**/*.{test,spec}.*"]
}
```

**Impact:** Broader ecosystem compatibility; cleaner npm package.

---

### 🟡 #3: Improve Test Coverage & Error Handling (4h)
**Files:** `vitest.config.ts`, `src/lib/router.ts`, test suite

**Issues:**
1. No coverage reporting
2. Missing test cases: hash mode, 404 fallback, concurrent nav, error boundaries
3. Silenced `.catch()` blocks (lines 161, 172)
4. Dummy test in `demo.spec.ts`

**Fixes:**
- Add `@vitest/coverage-v8` and configure in `vite.config.ts`:
  ```typescript
  coverage: {
    provider: 'v8',
    reporter: ['text', 'json', 'html'],
    exclude: ['node_modules/', 'dist/']
  }
  ```
- Test hash mode, 404 routes, error handling
- Replace `.catch(() => {})` with proper logging:
  ```typescript
  handleNavigation(p).catch((e) => console.error('Navigation failed:', e));
  ```
- Delete `src/**/*.spec.test.ts` (dummy tests)

**Impact:** Catches regressions; better debugging; confidence in refactors.

---

## Summary

**Overall Health:** ⭐⭐⭐⭐ (4/5)

The **idae-router is a well-architected, lightweight SPA router** with strong TypeScript support and good core test coverage. Codebase is clean and maintainable.

**Blockers before production:**
1. ✅ XSS risk via innerHTML (CRITICAL)
2. ✅ Package export issues (MEDIUM)
3. ✅ Error handling gaps (MEDIUM)

**Timeline:** All three fixes combined = **~7 hours**. Start with #1 & #2 (security/compatibility), then #3 (reliability).

---

**Audit Date:** 2026-03-02  
**Auditor:** BMAD Analyst  
**Baseline Status:** Established
