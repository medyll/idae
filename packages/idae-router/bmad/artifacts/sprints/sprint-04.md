# Sprint 04 – Generics, Type-Safety & Cache Engine

**Duration:** 2026-03-16 → 2026-03-30  
**Capacity:** 11 story points  
**Feature refs:** FT-02 (Type-Safety), FT-04 (Cache)  
**PRD:** [`bmad/artifacts/prd.md`](../prd.md)

---

## Sprint Goal

Lay the type-safety foundation (`Route<TData>`, `Context<TData>`) and deliver the SWR cache engine (`cache.ts`) with full router integration. By sprint end: navigating back to a cached route returns data synchronously, background revalidation is wired, and all public APIs have complete JSDoc. Existing routes must remain 100% unaffected.

---

## Stories

| ID | Epic | Title | Points | Priority | Status | Story |
|---|---|---|---|---|---|---|
| S04-01 | Types | Upgrade `types.ts` with `Route<TData>` / `Context<TData>` generics + JSDoc | 2 | Must | pending | [S04-01.md](../stories/S04-01.md) |
| S04-02 | DX | Full JSDoc coverage on all public exports | 2 | Must | pending | [S04-02.md](../stories/S04-02.md) |
| S04-03 | Cache | Create `src/lib/cache.ts` (SWR engine: set/get/invalidate/deepEqual) | 3 | Must | pending | [S04-03.md](../stories/S04-03.md) |
| S04-04 | Router | Integrate cache into `handleNavigation`: SWR flow + prefetch + buildUrl | 2 | Must | pending | [S04-04.md](../stories/S04-04.md) |
| S04-05 | Testing | Unit tests: type assertions, cache, router cache integration (≥90% coverage) | 2 | Must | pending | [S04-05.md](../stories/S04-05.md) |

**Total:** 11 points  
**Deferred (Sprint 05):** FT-03 (async state UI), FT-05 (search params), FT-06 (full nav API)

---

## Dependencies

- Sprint 01 build fix merged (✅ done — `package.json` build script pnpm fix 2026-03-02)
- Sprint 03 all stories implemented (✅ done — 27/27 tests pass)
- Sprint 02 (hash tests + publish v0.1.0) can run in parallel or precede this sprint

## Sequencing (within sprint)

```
S04-01 (types) → S04-02 (JSDoc)
           ↘
            S04-03 (cache) → S04-04 (router integration) → S04-05 (tests)
```

S04-01 must land first; S04-03 and S04-02 can proceed in parallel after S04-01.

---

## Definition of Done (sprint-level)

- [ ] All 5 stories implemented and code-reviewed
- [ ] `pnpm run test:unit` passes with no regressions (27+ prior tests still pass)
- [ ] `src/lib/cache.ts` ≥ 90% coverage
- [ ] `src/lib/router.ts` ≥ 75% coverage
- [ ] `tsc --strict --noEmit` on a consumer project using `Route<User>` compiles without errors
- [ ] All public symbols have JSDoc visible in VS Code hover
- [ ] `pnpm run build` passes (publint clean)
- [ ] `CHANGELOG.md` updated for planned v0.2.0 entry (cache + generics)

---

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Generic refactor introduces breaking `ctx.data` type changes for consumers using `unknown` | Low | Default `TData = unknown`; `ctx.data` was `data?: unknown` before, now `data: TData \| null` — test real consumers |
| SWR background revalidation causes race conditions on rapid navigation | Medium | Cancel revalidation AbortController on next navigation; test with sequential rapid clicks |
| `deepEqual` for large JSON payloads is CPU-heavy | Low | Benchmark with 100-field objects; add size guard (skip deep-equal for entries > 50 KB) |
