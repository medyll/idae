# idae-machine — Status Report
_Generated: 2026-05-13 | Phase: development | Progress: 60%_

---

## Architecture Decision (locked)

**MongoDB `appscheme_*` = source of truth. `testScheme.ts` = bootstrap tool only.**

```
testScheme.ts → seedSchemeFromModel() → MongoDB {org}_machine_app
                                               ↓ GET /api/scheme
                                        machine.fetchSchema() → IDB cache → machine.start()
```

DB naming: `{org}_{base}` → `test_machine_base`
Offline: stale-while-revalidate via IDB `_idae_schema_cache`

Full arch doc: `bmad/artifacts/docs/ARCH-SCHEMA-FROM-MONGO.md`

---

## Sprint Roadmap

| Sprint | Goal | Status | Stories |
|--------|------|--------|---------|
| S1-S5  | Foundation, data, realtime, router, polish | done | — |
| **S6** | Fix moduleDbName() + MongoDB URI | todo | S6-01 |
| **S7** | seedSchemeFromModel → MongoDB appscheme_* | todo | S7-01 |
| **S8** | GET /api/scheme + multi-DB routing | todo | S8-01, S8-02 |
| **S9** | machine.fetchSchema() + IDB cache | todo | S9-01 |
| **S10** | Tests + testScheme → bootstrap/ | todo | S10-01 |

---

## Story Dependencies

```
S6-01 (fix moduleDbName)
  └─ S7-01 (seedSchemeFromModel)
       ├─ S8-01 (GET /api/scheme)
       │    └─ S9-01 (fetchSchema client)
       │         └─ S10-01 (tests + cleanup)
       └─ S8-02 (multi-DB routing)  ← parallel with S8-01
```

---

## Next Action

**S6-01** — Fix `moduleDbName()` in `src/lib/main/machine.ts`:
- `{org}_{base}` not `{org}_{domain}_{base}`
- Remove DB name from `server/.env` MONGODB_URI
- Add `MONGO_ORG=test` to `.env`

Run `bmad-continue` to start implementation.

---

## Risk Register

| Risk | Severity | Mitigation |
|------|----------|-----------|
| IdbqModel not type-safe over wire | Medium | Zod validation on parse |
| mongoose useDb connection leak | Medium | useCache:true |
| Bootstrap wipes prod data | Critical | POST /api/bootstrap dev-only |
| Stale schema after structural change | Low | idae:schema:updated event |
| Tests depend on hardcoded testScheme | High | mockSchemaFetch() helper (S10-01) |

---

## Artifacts Created

| File | Purpose |
|------|---------|
| `bmad/artifacts/docs/ARCH-SCHEMA-FROM-MONGO.md` | Full architecture doc |
| `bmad/artifacts/stories/S6-01-fix-moduleDbName.md` | Story — foundation fix |
| `bmad/artifacts/stories/S7-01-seedSchemeFromModel.md` | Story — bootstrap |
| `bmad/artifacts/stories/S8-01-server-scheme-route.md` | Story — schema API |
| `bmad/artifacts/stories/S8-02-server-multi-db-routing.md` | Story — multi-DB |
| `bmad/artifacts/stories/S9-01-machine-fetchSchema.md` | Story — client async |
| `bmad/artifacts/stories/S10-01-tests-adaptation.md` | Story — cleanup |
| `bmad/artifacts/sprints/sprint-6.md` to `sprint-10.md` | Sprint plans |
