Idae monorepo — BMAD audit summary (2026-03-24)

Summary:
- Audit type: full
- Baseline: true
- Initial score: 28
- Current score: 62
- Packages scanned: 20
- High-priority follow-ups: AUDIT-IQL-001, AUDIT-DB-001

Findings:
1. Type-safety gaps: multiple @ts-ignore usages remain (focus: idae-idbql)
2. Missing integration tests: ChromaDB adapter untested
3. Inconsistent test naming across packages
4. Sparse JSDoc coverage in core data-layer packages

Recommendations:
- Start AUDIT-IQL-001: remove @ts-ignore; add targeted type fixes and tests
- Start AUDIT-DB-001: add ChromaDB unit & integration tests; mock/CI job
- Standardize test filenames and add lint rule
- Increase JSDoc coverage incrementally per package

Artifacts produced:
- bmad/status.yaml (updated)
- bmad/artifacts/audit-summary-2026-03-24.md

[DONE: updated status.yaml audit fields and created audit-summary-2026-03-24.md]
[NEXT: Begin AUDIT-IQL-001 (Developer) — bmad continue]
