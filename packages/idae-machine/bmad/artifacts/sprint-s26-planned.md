# Sprint 26 — System Collection Rename: `_*` → `appuser_*`

**Goal:** Rename `_prefs`, `_activity`, `_history` to follow project naming conventions. Audit doublon `appuser_audit` vs `appuser_activity`.

**Date:** planned (after S25)
**Status:** planned

---

## Problem

`_prefs`, `_activity`, `_history` break the project naming convention:

```
appscheme_*  → schema/structure entities
appuser_*    → user-scoped entities  (appuser_grant, appuser_group, appuser_session…)
appimage_*   → image entities
```

The `_` prefix was a shorthand hack. These are all **per-user data** → belong in `appuser_*` domain.

## Renames

| Current | Correct | Semantics |
|---------|---------|-----------|
| `_prefs` | `appuser_prefs` | per-user key-value preferences (theme, UI, settings) |
| `_activity` | `appuser_activity` | user action event log (CRUD, navigate, search) |
| `_history` | `appuser_history` | navigation trail + recently visited records |

## Decision: `appuser_audit` vs `appuser_activity` — RESOLVED

`appuser_audit` exists in idae-model-core RBAC (`ops: ['R','L']`, readonly, FK appuser, fields: action/ipAddress/sessionId/failureReason/status). It is the **security/system audit log** — admin-only, read-only.

`appuser_activity` (renamed from `_activity`) = **user-facing event log** — read-write, type: crud|navigate|search.

**Keep separate. No merge.** Different semantics, different access rights, different consumers.

## Base field correction

Current `_prefs/_activity/_history` base = likely `'machine_app'`.
Correct base = `'machine_user'` (per-user data, not schema/config data).

---

## Stories

### S26-01 — RESOLVED (no code story needed)

`appuser_audit` = security log (readonly, admin). `appuser_activity` = user event log (rw). Keep separate.

---

### S26-02 — Rename in idae-model-core.ts (effort: S)

**Acceptance:**
- `src/lib/types/idae-model-core.ts`: rename `_prefs` → `appuser_prefs`, `_activity` → `appuser_activity`, `_history` → `appuser_history`
- `base` field set to `'machine_user'` for all three
- `keyPath: '++id'` preserved
- No other logic change

**Files:**
- `src/lib/types/idae-model-core.ts`

---

### S26-03 — Update all references (effort: M)

**Acceptance:**
- Grep `'_prefs'`, `'_activity'`, `'_history'` across `src/` and `server/`
- Update every reference to new names
- Update `machine.ts` `buildEffectiveModel()` if it references old names directly
- Update tests: `machinePrefs.test.ts`, `machineActivity.test.ts`, `machineHistory.test.ts`
- Update barrel exports in `src/lib/index.ts` if any

**Search targets:**
```
grep -r "_prefs\|_activity\|_history" src/ server/
```

---

### S26-04 — IDB version bump + migration note (effort: S)

**Acceptance:**
- IDB store names change → existing `testdb` at version 1 must bump to version 2
- Update `machine.init({ version: 2 })` in `+layout.svelte`
- Document: users must clear IDB on upgrade (DevResetPanel → Clear IDB)
- No automatic IDB migration needed (dev context, demo data)

**Files:**
- `src/routes/+layout.svelte` (version bump)
- `bmad/conventions.md` (note: IDB version = increment on store rename)

---

### S26-05 — Tests + check (effort: S)

**Acceptance:**
- `pnpm run test` → ≥ 439/439
- `pnpm run check` → 0 new errors
- Grep confirms zero remaining `'_prefs'|'_activity'|'_history'` string literals in src/

---

## Invariants

- `appuser_audit` (server-side, MongoDB) untouched until S26-01 decision
- `__outbox__` (qoolie-internal IDB store) — not renamed, not in app model
- Pattern enforced: no new `_*` system collection names, always `app{domain}_*`
