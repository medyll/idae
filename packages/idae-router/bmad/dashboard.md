# 📋 BMAD Dashboard – idae-router

**Package:** @medyll/idae-router  
**Phase:** Implementation (In Progress)  
**Progress:** 50% (Sprint 01 implemented · PRD FT-01 defined)  
**Last Updated:** 2026-03-02

---

## 🏗️ Project Status

```
Phase 1 – Analysis      ✅ Done
  ├─ Audit (Baseline)   ✅ Complete
  └─ Findings           ✅ 5 critical/medium issues identified
Phase 2 – Planning      ✅ Done
  ├─ Sprint 01          ✅ Created (8 points)
  └─ Stories            ✅ 4 stories created
Phase 3 – Implementation ⏳ In progress (85% done)
  ├─ S01-01 (XSS)       ✅ Implemented
  ├─ S01-02 (CJS)       ✅ Implemented
  ├─ S01-03 (Errors)    ✅ Implemented
  └─ S01-04 (Coverage)  ✅ Implemented
Phase 4 – Testing & Release ⏳ Upcoming
Planning – FT-01 PRD     ✅ Defined (http/http_source)
```

---

## 📊 Sprint 01: Security & Compatibility Hardening (85% Complete)

**Duration:** 2026-03-02 → 2026-03-09  
**Capacity:** 8 story points | **Status:** In Development

| ID | Epic | Title | Points | Status |
|---|---|---|---|---|
| S01-01 | Security | Fix XSS vulnerability in render.ts | 3 | ✅ Implemented |
| S01-02 | Packaging | Add CommonJS export to package.json | 2 | ✅ Implemented |
| S01-03 | Error Handling | Replace silenced catch() with proper logging | 2 | ✅ Implemented |
| S01-04 | Testing | Add test coverage reporting | 1 | ✅ Implemented |

**Sprint Goal:** ✅ Complete (all stories coded)

---

## 🔧 Implementations Completed

### ✅ S01-01: XSS Fix
**File:** `src/lib/render.ts`
- Detects HTML-like strings (presence of `<`)
- Attempts sanitization with DOMPurify (if available)
- Falls back to `textContent` for safety
- Plain text content uses `textContent` by default

### ✅ S01-02: CommonJS Export  
**File:** `package.json`
- Added `"main": "./dist/index.js"` field
- Updated `files` glob: `["dist", "!dist/**/*.{test,spec}.*"]`
- Maintains ESM as primary via `svelte` field

### ✅ S01-03: Error Handling
**Files:** `src/lib/types.ts`, `src/lib/router.ts`
- Added `onError?: (error: Error, path: string) => void` to `RouterInstance`
- Replaced all silenced `.catch(() => {})` with proper error handler
- Created `handleError()` function with console.error fallback
- Errors logged: `[Router] Navigation to "path" failed: Error`

### ✅ S01-04: Test Coverage Setup
**Files:** `vite.config.ts`, `package.json`
- Added coverage provider: `@vitest/coverage-v8`
- Configured reporters: text, json, html
- Set thresholds: 75% lines/functions/statements, 70% branches
- Added script: `npm run test:coverage`

---

## ⏭️ Next Steps

### Immediate (Code Review & Testing)
1. ✅ All 4 stories have code changes
2. ⏳ **Run tests:** `npm run test:unit` (verify no regressions)
3. ⏳ **Run build:** `npm run build` (verify packaging)
4. ⏳ **Run coverage:** `npm run test:coverage` (check baseline)
5. ⏳ **Code review** on all changes
6. ⏳ **Merge to main** once passing

### This Week (Remaining)
- Verify all tests pass
- Review & merge changes
- Optional: Publish to npm (if using npm registry)

### Next Sprint (02)
- Expand test coverage (hash mode, 404 routes, concurrent navigation)
- Achieve 85%+ coverage target
- Publish release notes

### Sprint 03 – Route HTTP Data-Fetching (FT-01)

**Duration:** 2026-03-09 → 2026-03-16 | **Capacity:** 10 points | **Status:** Ready

| ID | Epic | Title | Points | Priority | Status |
|---|---|---|---|---|---|
| [S03-01](artifacts/stories/S03-01.md) | Types | Extend `Route` + `Context` types | 1 | Must | ⏳ pending |
| [S03-02](artifacts/stories/S03-02.md) | Core | Create `src/lib/fetcher.ts` | 3 | Must | ⏳ pending |
| [S03-03](artifacts/stories/S03-03.md) | Core | Integrate fetcher into `router.ts` | 2 | Must | ⏳ pending |
| [S03-04](artifacts/stories/S03-04.md) | Security | Origin pinning + HTTPS enforcement | 2 | Must | ⏳ pending |
| [S03-05](artifacts/stories/S03-05.md) | Testing | Unit tests for fetcher + integration | 2 | Must | ⏳ pending |

**Sprint Goal:** Ship `http`/`http_source` route options end-to-end with full type safety and test coverage.

---

## 📋 Definition of Done (Sprint Level)

- [ ] All **Must** stories (S01-01, S01-02, S01-03) implemented & code-reviewed
- [ ] Unit tests passing (`npm run test:unit`)
- [ ] E2E tests passing (`npm run test:e2e`)
- [ ] Build succeeds (`npm run build` + `publint` validation)
- [ ] Coverage baseline established (`npm run test:coverage`)
- [ ] Code reviewed & approved
- [ ] CHANGELOG updated with breaking/security changes
- [ ] Dashboard updated with sprint completion status

---

## 🎯 Recommended Next Action

👉 **Run:** `/dev-story S03-01` — types are the unblocking first step.

Sequence: S03-01 → S03-02 → S03-03 + S03-04 (parallel) → S03-05

---

## 📊 Codebase Snapshot

| Metric | Value |
|--------|-------|
| **Source Files** | 7 (TypeScript) |
| **Lines of Code** | ~450 (+30 from implementations) |
| **Unit Tests** | 7 (existing) |
| **E2E Tests** | 4 (existing) |
| **TypeScript Strict** | ✅ Yes |
| **Runtime Dependencies** | 0 ✅ |
| **Peer Dependencies** | 1 (Svelte ^5.0.0) |
| **Bundle Size** | ~2.5 KB gzipped (estimated) |

---

**Status:** Ready for Testing & Code Review  
**Recommendation:** Run tests and build validation


