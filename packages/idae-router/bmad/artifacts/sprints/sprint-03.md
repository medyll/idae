# Sprint 03 – Route-Level HTTP Data-Fetching

**Duration:** 2026-03-09 → 2026-03-16  
**Capacity:** 10 story points  
**Feature:** FT-01 · PRD: [`bmad/artifacts/prd.md`](../prd.md)

---

## Sprint Goal

Ship the `http` / `http_source` route options end-to-end: type definitions, fetch utility, router integration, security enforcement, and unit-test coverage. Existing routes must remain 100% unaffected.

---

## Stories

| ID | Epic | Title | Points | Priority | Status |
|---|---|---|---|---|---|
| S03-01 | Types | Extend `Route` + `Context` types for http data-fetching | 1 | Must | pending |
| S03-02 | Core | Create `src/lib/fetcher.ts` (URL resolution + fetch) | 3 | Must | pending |
| S03-03 | Core | Integrate fetcher into `handleNavigation` in `router.ts` | 2 | Must | pending |
| S03-04 | Security | Enforce origin pinning (`http`) and HTTPS (`http_source`) | 2 | Must | pending |
| S03-05 | Testing | Unit tests for fetcher + router integration | 2 | Must | pending |

**Total:** 10 points  
**Could (deferred to Sprint 04):** S03-06 — JSON `<pre>` fallback render when `action` absent (FR-09, 1 pt)

---

## Dependencies

- Sprint 01 stories (S01-01 XSS fix) merged — `render.ts` must be stable before integration.
- Native `fetch` available in target environment (no polyfill added by this sprint).

---

## Definition of Done (sprint-level)

- [ ] All 5 Must stories completed and code-reviewed
- [ ] `npm run test:unit` passes with no regressions
- [ ] New unit tests cover: URL resolution, param interpolation, `ctx.data` injection, error path, security constraints
- [ ] TypeScript strict compilation passes (`npm run build`)
- [ ] `src/lib/index.ts` exports `RouteHttpConfig` type
- [ ] Existing routes (no `http`/`http_source`) behave identically to pre-sprint

---

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| `fetch` not available in SSR/JSDOM test env | Medium | Mock `globalThis.fetch` in test setup; document requirement in README |
| CORS errors in `http_source` swallowed silently | Low | Errors set `ctx.error`; unit test asserts non-null `ctx.error` on network failure |
| Double-fetch if `action` also calls `fetch` | Low | Document in API: if `http`/`http_source` present, prefer `ctx.data` over manual fetch |
