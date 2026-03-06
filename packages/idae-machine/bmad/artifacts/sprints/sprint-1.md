# Sprint 1 – Type Safety & Validation Foundation

**Duration:** 2026-03-07 → 2026-03-20 (2 weeks)  
**Capacity:** ~14-16 story points (5-6 stories, ~18 engineering hours)  
**Sprint Goal:** Fix 3 critical audit findings (type safety, form validation, parser tests) and improve code documentation to 80%+ JSDoc coverage.

---

## Stories

| ID | Epic | Title | Points | Priority | Status |
|---|---|---|---|---|---|
| S1-01 | Type Safety | Replace 42+ `any` type instances with strict generics | 5 | **Must** | Ready |
| S1-02 | Validation | Complete form validation pipeline (custom + cross-field) | 5 | **Must** | Ready |
| S1-03 | Testing | Add machineParserForge test coverage (30+ cases) | 3 | **Must** | Ready |
| S1-04 | Documentation | Improve JSDoc coverage from 4.5% to 80%+ | 3 | **Must** | Ready |
| S1-05 | Reactivity | Fix FieldValue.svelte bidirectional binding | 2 | **Should** | Ready |

**Total Capacity**: 18 points (all 5 stories fit in 2-week sprint)

---

## Sprint Goal Statement

> **Establish type safety & validation robustness** — eliminate critical audit findings (42+ `any` types, incomplete form validation, untested parser), reach 80%+ JSDoc coverage, and stabilize reactive form binding to unblock v0.140 release.

---

## Dependencies

- **External**: None
- **Internal**: 
  - S1-01 (type safety) should complete before S1-02 (validation) to avoid re-typing
  - S1-03 (parser tests) can run in parallel with S1-01
  - S1-04 (docs) can run in parallel with all stories

---

## Epics & Traceability

### Epic 1: Type Safety
- **Linked Audit Finding**: "Type Safety: 42+ `any` instances"
- **Linked PRD**: FR requirement: "100% type coverage" (Tech Spec: Type Safety section)
- **Stories**: S1-01

### Epic 2: Form Validation
- **Linked Audit Finding**: "Form Validation Incomplete"
- **Linked PRD**: FR-3.1 through FR-3.9 (validation requirements)
- **Stories**: S1-02

### Epic 3: Testing & Coverage
- **Linked Audit Finding**: "MachineParserForge has NO test coverage"
- **Linked PRD**: NFR: ">80% unit test coverage"
- **Stories**: S1-03

### Epic 4: Documentation
- **Linked PRD**: NFR: ">80% JSDoc coverage"
- **Stories**: S1-04

### Epic 5: Reactivity
- **Linked Audit Finding**: "Reactive state binding gap"
- **Stories**: S1-05

---

## Definition of Done (Sprint-level)

- [ ] All Must stories (S1-01, S1-02, S1-03, S1-04) completed and code reviewed
- [ ] All type safety: 0 `any` instances (except deliberate escapes)
- [ ] Validation tests: 100% of FR-3.x requirements passing
- [ ] Parser tests: 30+ test cases passing
- [ ] JSDoc coverage: 80%+ (measure with tooling)
- [ ] FieldValue.svelte binding tests passing
- [ ] Build: `pnpm run build` succeeds
- [ ] All tests pass: `pnpm run test` (100% success)
- [ ] Type check: `pnpm run check` (0 errors)
- [ ] Lint: `pnpm run lint` (0 violations)
- [ ] PR reviews completed + merged
- [ ] Update `status.yaml.phase` to "solutioning (in_progress)"
- [ ] Update `dashboard.md` with sprint results

---

## Risks & Mitigation

| Risk | Likelihood | Mitigation |
|------|-----------|-----------|
| Type safety refactor too broad (cascade changes) | Medium | Break into 3 sub-tasks: (1) utility functions, (2) core Machine classes, (3) form components |
| Custom validators API design unclear | Low | Use PR discussion to align on async/sync; follow PRD FR-3.5 |
| Parser test edge cases hard to enumerate | Medium | Start with happy path (20 cases), add edge cases incrementally based on code review feedback |
| JSDoc tooling inconsistent | Low | Use `type-coverage` npm package; document rules in PR comment |
| Binding fix may regress other components | Medium | Add e2e test for in-place editing (UC-03) before merging |

---

## Acceptance Criteria (Sprint-level)

```gherkin
Feature: Type Safety
  Given the codebase has 42+ `any` instances
  When developers apply strict generics + type inference
  Then 0 `any` instances remain (except 1-2 deliberate escapes documented)

Feature: Form Validation
  Given a form with required, readonly, custom, and cross-field rules
  When user submits invalid data
  Then all violations are caught and displayed inline with clear error messages

Feature: Parser Tests
  Given the MachineParserForge class with 0 test coverage
  When developers write 30+ test cases covering DSL patterns
  Then all tests pass with 95%+ branch coverage

Feature: Documentation
  Given 4.5% JSDoc coverage baseline
  When developers add missing @param, @return, @throws annotations
  Then 80%+ of public APIs have complete JSDoc

Feature: Reactive Binding
  Given FieldValue.svelte with incomplete two-way binding
  When user edits field and loses focus
  Then parent form state updates automatically
```

---

## Kanban Board

```
NOT STARTED (5)
├─ S1-01: Type Safety (5pt)
├─ S1-02: Validation (5pt)
├─ S1-03: Parser Tests (3pt)
├─ S1-04: JSDoc (3pt)
└─ S1-05: Binding (2pt)

IN PROGRESS (0)

IN REVIEW (0)

DONE (0)
```

---

## Story Breakdown & Sequence

### Recommended Dev Order:
1. **S1-03 (Parser Tests)** — Fast feedback loop, no blockers on type safety (3h)
2. **S1-01 (Type Safety)** — Foundation for S1-02 (8h)
3. **S1-02 (Validation)** — Uses types from S1-01 (12h)
4. **S1-04 (JSDoc)** — Can run parallel with above; no blockers (9h)
5. **S1-05 (Binding)** — Unblocked; light touch (5h)

### Parallel Work:
- Developer 1: S1-03, S1-01, S1-02 (sequential, 23h total)
- Developer 2: S1-04 (parallel, 9h) + S1-05 (parallel, 5h) = 14h

**Estimated Team Capacity**: 2 devs × 10 hours/day × 10 days = 200 dev-hours  
**Estimated Sprint Load**: ~37 hours (well below capacity)  
**Buffer**: 163 hours for reviews, debugging, unforeseen issues

---

## Technical Context

### Codebase Snapshot (v0.135.2)
- **Svelte 5 Compliance**: ✅ 100% (no deprecated APIs)
- **Type Coverage**: 95% (42+ `any` to fix)
- **Test Coverage**: 75% unit (5 test files; parser untested)
- **JSDoc Coverage**: 4.5% (need +50 blocks)
- **Build Time**: ~3s (Vite dev), <10s (production)

### Key Files to Touch
- `src/lib/main/machine/` — Type safety fixes
- `src/lib/main/machine/MachineSchemeValidate.ts` — Validation expansion
- `src/lib/main/__tests__/` — New test files + expanded coverage
- `src/lib/form/FieldValue.svelte` — Reactive binding fix
- All public `.ts` files — JSDoc additions

### Build & Test Commands
```bash
pnpm run build         # SvelteKit + svelte-package
pnpm run test          # Vitest single-run
pnpm run test:unit     # Watch mode
pnpm run check         # Type check
pnpm run lint          # ESLint + Prettier
```

---

## Outcomes & Success Metrics

| Metric | Current | Sprint Target | v1.0 Target |
|--------|---------|---------------|-------------|
| **Type Safety (`any` count)** | 42 | 0 | 0 |
| **JSDoc Coverage** | 4.5% | 80%+ | 80%+ |
| **Unit Test Coverage** | 75% | 90%+ | 95%+ |
| **Build Status** | ✅ Pass | ✅ Pass | ✅ Pass |
| **Lint Status** | ✅ Pass | ✅ Pass | ✅ Pass |

---

## Revision History

| Date | Author | Change |
|------|--------|--------|
| 2026-03-06 | Scrum Master (BMAD) | Initial Sprint-1 plan |

---

## Sign-Off

**Scrum Master:** Approved ✅  
**Date:** 2026-03-06  
**Ready for:** `bmad dev story S1-01` (start first story)
