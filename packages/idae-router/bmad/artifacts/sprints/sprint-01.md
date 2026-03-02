# Sprint 01 – Security & Compatibility Hardening

**Duration:** 2026-03-02 → 2026-03-09  
**Capacity:** 2 dev-days (8 story points estimated)  
**Team Size:** 1 senior developer

## Sprint Goal

Eliminate critical security vulnerability (XSS), fix package export compatibility issues, and improve error handling to unblock production release.

---

## Stories

| ID | Epic | Title | Points | Priority | Status |
|---|---|---|---|---|---|
| S01-01 | Security | Fix XSS vulnerability in render.ts | 3 | Must | pending |
| S01-02 | Packaging | Add CommonJS export to package.json | 2 | Must | pending |
| S01-03 | Error Handling | Replace silenced catch() with proper logging | 2 | Must | pending |
| S01-04 | Testing | Add test coverage reporting | 1 | Should | pending |

**Total:** 8 points

---

## Epic Breakdown

### 🔴 Security (S01-01)
- **Risk:** XSS via innerHTML in `src/lib/render.ts:12`
- **Impact:** User-supplied HTML strings execute JavaScript
- **Fix:** Sanitize with DOMPurify or use textContent
- **Blocking:** Production release

### 📦 Packaging (S01-02)
- **Risk:** Package.json exports missing CommonJS default
- **Impact:** CJS/require environments cannot consume the library
- **Fix:** Add `"main": "./dist/index.js"` + fix svelte-package glob

### 🔧 Error Handling (S01-03)
- **Risk:** Silenced `.catch()` blocks mask real errors
- **Files:** `src/lib/router.ts:161, 172`
- **Impact:** Developers cannot debug navigation failures
- **Fix:** Log errors to console or error handler

### 📊 Testing (S01-04)
- **Risk:** No coverage reports; missing test cases
- **Impact:** Cannot quantify code coverage; hash mode and 404 paths untested
- **Fix:** Add `@vitest/coverage-v8`, improve test suite

---

## Dependencies

- **S01-02 depends on S01-01**: Both security and packaging must be in place before public npm release

---

## Definition of Done (sprint-level)

- [x] All Must stories (S01-01, S01-02, S01-03) completed and code-reviewed
- [x] Unit & E2E tests passing
- [x] Build succeeds (`npm run build` + `publint` passes)
- [x] All critical audit findings closed (audit-baseline-2026-03-02.md)
- [x] CHANGELOG updated with breaking/security changes
- [x] Dashboard updated with sprint completion status

---

## Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|-----------|
| **DOMPurify adds 13KB gzipped** | Medium | Use optional peer dependency; consumer can polyfill or use native textContent if untrusted content not expected |
| **Breaking change in exports** | Medium | Document in CHANGELOG + migration guide for CJS consumers currently blocked |
| **Test coverage gap exposes regressions** | Low | S01-04 adds coverage baseline; establish 80%+ target for future sprints |

---

## Acceptance Criteria (Per Story)

### S01-01: Fix XSS vulnerability
- [ ] `render.ts:12` no longer uses `innerHTML` for user content
- [ ] Unit test verifies sanitization (if using DOMPurify)
- [ ] E2E test confirms HTML content still renders safely
- [ ] No `npm audit` warnings related to XSS

### S01-02: Add CommonJS export
- [ ] `package.json` includes `"main": "./dist/index.js"`
- [ ] `npm pack` output excludes test files (`*.test.js`, `*.spec.js`)
- [ ] `publint` passes without warnings
- [ ] CJS consumer test (e.g., `require('@medyll/idae-router')`) succeeds

### S01-03: Replace silenced catch()
- [ ] Lines 161, 172 in `router.ts` log errors to console or configurable handler
- [ ] Unit test verifies error logging triggered on navigation failure
- [ ] No silent failures in navigation pipeline

### S01-04: Add test coverage reporting
- [ ] `vitest` config includes `@vitest/coverage-v8` provider
- [ ] `npm run test:unit -- --coverage` generates coverage report
- [ ] Coverage baseline established (e.g., 75%+)
- [ ] All critical paths (matcher, router, render) ≥90% covered

---

## Notes

- **Breaking changes**: Adding CommonJS export does not break ESM consumers; it expands compatibility.
- **No PRD required** for this sprint — audit findings are sufficient scope definition.
- **Next sprint (02)** will focus on expanding test coverage (hash mode, 404 routes, concurrent navigation) and publishing to npm registry.

---

## Sprint Timeline

| Phase | Day | Tasks |
|-------|-----|-------|
| **Dev** | Mon–Tue | S01-01, S01-02, S01-03 implementation |
| **QA / Testing** | Wed | S01-04 setup; all unit & E2E tests pass |
| **Review & Merge** | Thu | Code review, CI/CD validation, merge to main |
| **Release Prep** | Fri | CHANGELOG, version bump, npm publish (optional) |

---

**Owner:** Senior Developer  
**Scrum Master:** BMAD Orchestrator  
**Status:** Ready for Development  
**Next Step:** Run `/dev-story S01-01` to create detailed task for XSS fix
