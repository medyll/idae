# UNHACK.md — Workaround / quick-win elimination backlog

> **Audit:** 2026-06-14. Scope: `src/lib` (client) + `server/src` (excl. tests, e2e, migration tooling).
> Migration code (`server/src/migrate/**`, `server/src/models/*/`) is intentional legacy-import
> machinery — explicitly **NOT** in scope.
> **Legend:** ✅ done · 🔴 confirmed behavioral hack · 🟡 needs a decision/verification · ⚪ type-debt (no behavioral risk).
> **Effort:** S < ~1h · M ~half-day · L multi-session.

---

## How to read this

Each item gives: **where** (file:line), **the actual code**, **why it exists** (the bug or constraint it
papers over), **what it costs** (the real failure mode today), **the proper fix** (with direction, not just
"do better"), and **the decision** blocking it where one exists. The goal is that any of these can be picked
up cold without re-deriving the context.

---

## Tier 0 — fixed this session

### 0. `rights` schema policy lost in the server→client round-trip ✅

- **Where:** `server/src/bootstrap/publishModel.ts` (scheme write ~L296), `server/src/MachineServer.ts#getModel` (~L161).
- **Symptom that surfaced it:** logging in as a **non-admin** showed a completely empty Explorer — not
  one collection in the left nav, not one row. Looked like a data problem; was an RBAC problem.
- **Root cause chain:**
  1. Explorer's left nav is `<DataList collection="appscheme" …/>` (`shell/frame/explorer/Explorer.svelte:28`).
  2. Rendering each row calls `MachineSchemeValues.format()` → `#checkAccess()` →
     `machineRights.checkAccess('appscheme','R')` (`MachineSchemeValues.ts:289`).
  3. `appscheme` *does* declare `rights: { ops:['R','L'], default:['R','L'] }` in `model-core.ts:73` —
     which would let any authenticated user read it via `checkAccess` step 8 (`default` policy).
  4. **But** `publishModel` never wrote `rights` into the `appscheme` meta-doc, and `getModel` never read
     it back. So the client's `MachineRights.#policies` was `{}`. With no policy, a non-admin falls through
     to `checkAccess` step 9 → **deny**. `format()` throws `ACCESS_DENIED` for every row → empty list.
  5. Commit `e5113773` had already tried to fix non-admins by hydrating *grants*, but meta collections
     rely on the `default` **policy**, not per-user grants — so they stayed denied.
- **Fix applied:**
  ```ts
  // publishModel.ts — scheme upsert doc
  ...(colDef.rights ? { rights: colDef.rights } : {}),
  // MachineServer.ts getModel — model[code] assembly
  ...(scheme.rights ? { rights: scheme.rights } : {}),
  ```
- **Activation:** requires a reseed so existing `appscheme` docs gain the field:
  `cd server && npx tsx src/bootstrap/bootstrap.ts demo`. Client auto-pulls the new model via schema drift on next reload.
- **Why it kept happening:** this is a symptom of **#3** — the client maintains its own copy of the
  authorization logic and must be spoon-fed every input (policies, grants, user flags). Miss one wire → silent deny.

---

## Tier 1 — confirmed behavioral hacks (priority)

### 1. `seedAiData` is a no-op stub ✅ done

- **Where (was):** `server/src/bootstrap/seedAiData.ts`, `server/src/bootstrap/seedImagePresets.ts` —
  both **deleted** (2026-06-14).
- **Original problem:** `seedAiData` logged success while inserting nothing (placeholder), and even the
  populated-but-unused `AI_CATALOGS`/`AI_DEMO_COMPANIONS`/`AI_DEMO_TAGS` consts that *did* eventually get
  wired up inserted docs **without an `id` field** (fake `providerIdMap`/`modelIdMap` pointed at nothing —
  FK fold via `ai_provider_id` resolved against non-existent ids, masked because runtime also resolves by
  `ai_provider_code`).
- **Fix applied — collapsed into the generic seed pipeline:**
  - New `server/src/bootstrap/seed/coreSeed.ts` → `idaeCoreSeed`, **same contract as `<org>Seed`**: flat
    rows, explicit numeric `id`, FK as scalar id (`ai_model: 1`), referentials before dependents. Covers
    `ai_provider/model/tool/*_status/companion`, `tag`, `appimage_preset`.
  - `bootstrap.ts`, `OrgAdminService.seedOrg`, `routes/bootstrap.ts adminResetHandler` now call
    `seedBusinessData({ org, mongoUri, model: buildEngineModel(), data: idaeCoreSeed, clearFirst: true })` —
    one call replaces both deleted scripts. Routing (`machine_ai`/`machine_app`) and FK fold come for free
    from `model[coll].base` + `foldFks`.
  - Bonus: AI catalogs are now seeded on **org creation** too (`OrgAdminService`/`/api/admin/reset`), which
    the old stub never covered.
  - `ImagePresetRegistry.loadAll()` already calls `createIndex({code},unique)` at runtime, so dropping
    `seedImagePresets`'s index creation is safe.
- **Side fix (idae-db, sibling package):** `seedBusinessData`'s upsert path needed
  `IdaeDbAdapter.findOneAndUpdate` — declared in `IdaeDbAdapterInterface` and implemented in
  `MongoDBAdapter`, but the public `IdaeDbAdapter` wrapper never proxied it (`adapter.findOneAndUpdate is
  not a function`). Added the proxy. Also `MongoDBAdapter.findOneAndUpdate` didn't assign the
  auto-increment `id` field on upsert-insert (Mongo's native upsert doesn't know our custom fieldId) —
  fixed to call `getNextIncrement()` via `$setOnInsert` on insert, mirroring `create()`. Rebuilt
  `idae-db` dist.
- **Verified:** `cd server && npx tsx src/bootstrap/bootstrap.ts demo` runs 0→6/6 clean; server
  `tsc --noEmit` 0 errors.

### 2. `DataListRelations` decides "loading vs absent" with a 50ms wall-clock timer ✅ done

- **Where:** `src/lib/data-ui/data/DataListRelations.svelte:43-61`.
- **The code:**
  ```ts
  const record = $derived.by(() => {
    if (data) return data;
    if (recordId == null) return null;
    return sourceStore.records.find((item) => String(item.id) === String(recordId)) ?? null;
  });

  let recordLookupSettled = $state(false);
  $effect(() => {
    void collection; void recordId; void data;
    recordLookupSettled = data != null || recordId == null;
    if (data != null || recordId == null) return;
    const timer = setTimeout(() => { recordLookupSettled = true; }, 50);  // ← magic
    return () => clearTimeout(timer);
  });

  const recordState = $derived.by(() => {
    if (record) return 'found';
    return recordLookupSettled ? 'absent' : 'loading';  // ← drives the UI
  });
  ```
- **Why it exists:** when resolving a record by `recordId` from the reactive store, there's no signal for
  "the store has finished hydrating this collection." Without one you can't tell *"record genuinely doesn't
  exist"* from *"store hasn't loaded yet"*. The 50ms timer is a guess that hydration completes within 50ms.
- **What it costs:** load slower than 50ms (cold IDB, big collection, slow device) → component declares the
  record **absent** and renders the empty/not-found state even though it's about to arrive. Load faster than
  50ms → a pointless 50ms "loading" flash on every mount. It's a race, dressed as a state machine.
- **Consumers (blast radius):** `DataListRfk.svelte` and `DataListFk.svelte` both render this — i.e. every
  FK/reverse-FK relation block on a record detail (Fiche relations).
- **Proper fix:** get a real readiness signal instead of a clock.
  - Preferred: expose a `loaded`/`settled` flag on the qoolie `ResultSet` returned by `machine.store`, and
    compute `recordState` from it. (This is the missing primitive — once it exists, several other places
    that fake "loaded" can use it too.)
  - Interim if qoolie can't provide it cheaply: when `data` isn't passed, resolve the single record through
    an explicit awaited read (`machine.store(collection,{id}).records[0]` gated on a promise) so absence is
    authoritative, not timed.
- **Effort:** M · **Risk:** med (changes reactive load semantics on a widely-used component — cover with the
  existing `DataRelations`/`dataList` tests).
- **Decision (2026-06-14):** `ResultSet.loaded` will never exist — rejected as a future primitive. Applied
  the interim fix: `DataListRelations.svelte` now checks the reactive store first; if the record isn't there,
  it does an explicit awaited `machine.collection(collection).get(recordId)`. `'absent'` is now set only when
  that read resolves empty — no timer. `DataListRfk`/`DataListFk` consumers unaffected (same prop contract).

### 3. Client RBAC mirror drifts from the server ✅ done (structural — root of #0)

- **Where:** `src/lib/main/machine/MachineRights.ts` (the mirror), fed from:
  - `src/routes/+layout.svelte#restoreSession` (L86-115) — rebuilds the user + grants from `localStorage`.
  - `src/lib/shell/auth/Login.svelte` (L41-49) — persists `auth_token`/`auth_user`/`auth_grants`.
  - `TaskBar` logout — clears `auth_grants`.
  - Server side it shadows: `server/src/services/GrantService.ts` (`listUserGrants`, `#loadSources`,
    `#loadGrants`, `resolveAccess`) + `server/src/middleware/permission.ts`.
- **What it is:** `checkAccess(collection, op)` is a 9-step resolver (`MachineRights.ts:69`) that
  re-implements, on the client, the same precedence the server already enforces: ops-whitelist → open-mode →
  public → user active/locked → ADMIN override → temporal grants → default policy → deny. To work it must be
  hand-fed three independently-sourced inputs:
  1. **policies** — from the model (`loadPoliciesFromModel`, broken until #0).
  2. **grants** — from the login response, round-tripped through `localStorage` (`auth_grants`).
  3. **user flags** — `appPermissions.ADMIN`, `isActive`, `isLocked`, reconstructed in `restoreSession`.
- **Why it exists:** offline-first. The client renders from IDB without a server round-trip, so it wanted a
  local gate to avoid showing data the server would reject.
- **What it costs:** every input is a separate wire that can break independently, and each break manifests as
  the same scary symptom — *non-admin sees nothing*. The history is a trail of patches to keep the mirror in
  sync: the grants commit (`e5113773`), the flat-vs-nested `schemeCode` fallback (`MachineRights.ts:97-100`),
  and #0. There are **two sources of truth** for authorization and they drift.
- **Proper fix (needs a decision — see below):**
  - **(a) Server-authoritative:** the server already filters/denies reads (`permission.ts`, `GrantService`).
    Make the client gate a pure **UI hint** (hide buttons/nav) that can *never* be the thing that empties a
    populated list. If the server sent the row, render it. Delete the client's ability to reject data it
    already holds.
  - **(b) Client-authoritative with a single hydration source:** stop reconstructing inputs from three
    `localStorage` keys. Have one `/api/session` call return `{ user, policies, grants }` atomically and feed
    `MachineRights` from that one payload; drop the piecemeal localStorage rehydration.
  - Either way: one source of truth, one wire to keep correct.
- **Effort:** L · **Risk:** high (auth surface). Land behind `machineRights.test.ts` + `rbac-matrix.spec.ts`.
- **Decision (2026-06-14):** option **(a) server-authoritative**. `MachineSchemeValues.format()` and
  `.indexValue()` no longer call `#checkAccess()` / throw `ACCESS_DENIED` — removed along with the now-unused
  `#checkAccess()` private method and the `machineRights` import. If the server sent the row, the client
  renders it; `machine.rights.checkAccess(...)` remains for UI hints (hide nav/buttons) elsewhere
  (`MachineRouter`, `MachineMcpClient`) but can no longer empty a populated list. The localStorage-fed grants
  (`auth_grants` etc.) still drive those UI hints — single-payload `/api/session` consolidation is a separate,
  un-started follow-up.

---

## Tier 2 — seed / schema papering

### 4. `getModel` mirrors `code`↔`name` at read time ✅ done

- **Where:** `server/src/MachineServer.ts:117-121`.
- **The code:**
  ```ts
  // Solidify code/name: every collection exposes both. Mirror the present
  // one onto the missing one so downstream (focus fallback, fk labels) can
  // always rely on code AND name.
  if (fields.code && !fields.name) fields.name = { ...fields.code };
  else if (fields.name && !fields.code) fields.code = { ...fields.name };
  ```
- **Why it exists:** downstream code (focus-field fallback, fk label resolution) assumes both `code` and
  `name` always exist. Some schemes declare only one.
- **What it costs:** the invariant "every collection has both code and name" is enforced at *read time, every
  read*, instead of once at publish. A scheme can be published in a state that violates the invariant and
  only get fixed on the way out — easy to forget when another read path is added.
- **Proper fix:** enforce it at publish. `publishModel`'s `ensureCodeField` already guarantees `code`; extend
  it to also guarantee `name` (mirror from `code` when absent). Then delete the read-side mirror — `getModel`
  can trust the stored docs.
- **Effort:** S · **Risk:** low.
- **Status:** done — `ensureCodeField` (`publishModel.ts:53-63`) mirrors `name` from `code` at publish time;
  read-side mirror removed from `MachineServer.ts` (comment at L117-118 documents the move).

### 5. `resolveFkIds` — two-phase fk write to dodge a chicken-and-egg ✅ done (meta path)

- **Where:** `server/src/bootstrap/publishModel.ts`, `server/src/bootstrap/resolveFkUtils.ts`,
  `../idae-db/src/lib/adapters/MongoDBAdapter.ts`.
- **What it was:** during publish, `fkRef()` snapshots were written with `id: null` because the target meta
  doc might not exist yet (collections reference each other across the seed loop). A post-pass `resolveFkIds`
  then walked **every** meta doc, found fk snapshots with `id == null && code != null`, looked up the real
  `id` by `code`, and patched it back in.
- **Why it existed:** the meta collections form a reference cycle (`appscheme` ↔ `appscheme_base` ↔
  `appscheme_type` …) so no single insertion order resolves all fks on first write.
- **Decision log (2026-06-14):**
  - First call (drop `id`, code-only resolution) was **wrong**, reverted same day — `dataRelationUtils.ts`
    reads `fks.{rel}.id` **first** (`targetIndex = obj['id'] != null ? 'id' : 'code'`). `id` is the canonical
    query key; `code` is the lookup/create key. Both stay — see [SEED.md](./SEED.md) for the full model.
  - Reframed goal: the smell wasn't `resolveFkIds` itself, it was the same "code → id, create if absent"
    operation hand-rolled three times (publish post-pass, `seedBusinessData` `seedMap`, `seedAiData` id-maps).
  - User: no clobber risk — `code` is a unique deterministic natural key and `$set` is additive, so the
    primitive collapses to a plain upsert: `findOneAndUpdate({code}, {$set:data}, {upsert:true,
    returnDocument:'after'}).id`.
- **Implemented (eager resolve-or-create, strategy B):**
  - `MongoDBAdapter.findOneAndUpdate` (new, idae-db) — exposes the upsert-with-`returnDocument:'after'` idiom.
  - `resolveOrCreateByCode()` (new, `resolveFkUtils.ts`) — the single "code → id, create if absent" primitive.
  - `publishModel.ts` rewritten: `resolveFkRef()` resolves every FK snapshot's `id` **eagerly at build time**
    via `resolveOrCreateByCode`. The `id:null` snapshots, the `resolveFkIds` post-pass, and the
    insertion-order contract for the meta path are all **gone** — verified by reading the file (no
    `resolveFkIds` symbol remains).
  - Verified: server `tsc --noEmit` 0 errors (after adding the missing `FkRef` type import), client+server
    test suite 47 files / 558 tests pass.
- **Not done (the "collapse all three" goal, partial):** `seedBusinessData.ts` still uses its in-memory
  `seedMap` + `foldFks`/`FkFolder` (referentials-before-dependents contract intact). `seedAiData.ts` is
  gone (#1) — its data now flows through `seedBusinessData` too, so it inherits the same `seedMap`
  contract rather than `resolveOrCreateByCode`. Only the meta/schema path (`publishModel.ts`) uses
  `resolveOrCreateByCode`; collapsing `seedBusinessData`'s `seedMap` onto it remains optional follow-up.

---

## Tier 3 — low-risk cleanups

### 6. Hardcoded org list in the login screen ✅ closed — dev-only

- **Where:** `src/lib/shell/auth/Login.svelte:11` → `src/lib/config.ts:20` (`ORGS`).
- **Decision (2026-06-14):** the org dropdown is a **dev convenience**, not a prod tenant picker. Static
  list in `config.ts` is the right shape for that. API-served org list would be solving a problem that
  doesn't exist for the real login flow. No further action.

### 7. Swallowed error in prefs hydration ✅ done

- **Where:** `src/lib/data-ui/utils/useMachinePrefs.svelte.ts:112-123`.
  ```ts
  Promise.resolve(machine.collection('appuser_prefs').getAll())
    .then((rows) => { /* apply persisted slots */ })
    .catch(() => {})                       // ← silently eats IDB/permission failures
    .finally(() => { st.hydrated = true; });
  ```
- **Also nearby (L103):** `if (!user) { st.hydrated = true; return; }  // retry once a user is set` — relies on
  the `$effect` re-running when `machine.rights.currentUser` becomes set. That part is fine (reactive), but
  the empty catch hides real failures (e.g. the prefs read denied by the very RBAC gate in #3).
- **Proper fix:** `console.warn` the error at minimum; ideally set a `degraded` flag on the prefs store so the
  UI can tell "prefs unavailable" from "prefs are all defaults."
- **Effort:** S · **Risk:** none.
- **Status:** done — catch now `console.warn`s (`useMachinePrefs.svelte.ts:121-123`). `degraded` flag not
  added (low priority, no UI consumes it yet).

### 8. `machineParserForge` — untyped rule casts ✅ done

- **Where:** `src/lib/main/machineParserForge.ts`.
- **Fix (2026-06-14):** `#fromObjectRule`/`#argsFromObject` now take `rule: MachineFieldDef` directly (the
  object-rule branch of `TplFieldRules`) instead of `rule as any` — `.type`/`.required`/`.readonly`/`.private`
  are typed fields on `BaseFieldDef`, no cast needed. `group` is destructured out alongside the other known
  base keys (it's scheme metadata, not part of `IDbForge`). `is: what`/`is: type` already matched
  `IDbForge['is']` exactly, so the `as any` there was dead weight. In `extract`, `extractArgs` now returns
  `string[] | undefined` directly (matching `IDbForge['fieldArgs']`) instead of the mismatched `TplFieldArgs`
  (`= string`) alias, and `fieldType` assignments no longer need `as unknown as TplFieldType` since
  `TplFieldType = string`.
- **Result:** all 7 `as any`/`as unknown` casts and their `eslint-disable` comments removed. Forge stays pure
  and deterministic (invariant #5 intact). `pnpm run check` 0 errors, `pnpm run test` 590/590 passing.

---

## Tier 4 — boot/recovery (mostly legitimate — verify, don't reflexively rip out)

### 9. `recoverFromCorruptBoot` — wipe local state and reload ✅ done

- **Where:** `src/routes/+layout.svelte:62-84`.
- **What it does:** on boot failure, behind a `sessionStorage` one-shot flag, it removes `auth_token` /
  `auth_user` / `idae_org`, deletes the IDB database, and `window.location.reload()`s. If it fails again
  (flag already set) it rethrows the real error.
- **Why it exists:** non-dev users hitting a stale-token / IDB-version-drift / corrupt-schema-cache boot would
  otherwise see a raw "Boot failed" screen needing a manual `localStorage.clear()`.
- **Status:** the net is legit (keep it). The original `err` is already logged before wiping —
  `console.warn('[idae-machine] Boot failed, clearing local state and retrying:', err)` (L74), ahead of the
  localStorage/IDB wipe (L76-83). Underlying causes are diagnosable from console. No further action.

### 10. `warmup` blocking render + hand-maintained collection list ✅ done

- **Where:** `src/lib/main/machine.ts#warmup` (L383), `src/lib/main/warmupUtils.ts` (new),
  `src/routes/+layout.svelte:51`.
- **What it was:** hardcoded array of schema-critical collections:
  ```ts
  await machine.warmup(['appscheme','appscheme_field','appscheme_view','appscheme_view_type','appscheme_has_field']);
  ```
- **Why flagged:** the list had to be manually kept in sync with the set of collections that feed the
  shell UI. Adding/removing meta collections required editing the literal array — easy to forget, leading
  to empty-set flashes or unnecessary hydration.
- **Implemented:**
  - `getSchemaCriticalCollections(model, bases)` (new, `warmupUtils.ts`) — derives the warmup set from
    the MachineModel. Defaults to `base === 'machine_app'` (schema metadata), extensible to include
    `machine_user` and `machine_ai` via the `bases` parameter.
  - `getComprehensiveWarmupCollections(model)` — convenience wrapper that includes all three core
    bases (`machine_app`, `machine_user`, `machine_ai`) for broader warmup scenarios.
  - `machine.warmup()` updated: when called without arguments, it auto-derives the collection list from
    `this._effectiveModel` using `getSchemaCriticalCollections`. Explicit array still supported for
    specific use cases (e.g., `diagramUtils.ts` deep-link warmup).
  - `+layout.svelte` simplified: `await machine.warmup()` — no literal array, no manual maintenance.
- **Verified:**
  - `svelte-check` 0 errors after adding type annotations.
  - Warmup behavior unchanged: same collections hydrated, but now derived from the model.
  - Future-proof: new `machine_app` collections auto-included; adding `machine_user`/`machine_ai` is
    a one-line parameter change in `warmupUtils.ts`.

---

## Suggested order

1. ✅ **#1 seedAiData** — done (2026-06-14: collapsed into generic `seedBusinessData`+`idaeCoreSeed` pipeline, `seedAiData.ts`/`seedImagePresets.ts` deleted).
2. ✅ **#7 swallowed catch** — done. ✅ **#6 ORGS** — closed, dev-only dropdown (see decision below).
3. ✅ **#4 name mirror** — done.
4. ✅ **#2 DataListRelations timer** — done (interim fix, `ResultSet.loaded` rejected — see decision below).
5. ✅ **#5 resolveFkIds** — meta path done. `id` stays (canonical query key); eager `resolveOrCreateByCode`
   primitive lives in idae-db, used throughout `publishModel.ts`, post-pass removed. See [SEED.md](./SEED.md).
   `seedBusinessData`/`seedAiData` not converted (separate, optional follow-up).
6. ✅ **#3 RBAC mirror** — done (decision: server-authoritative, see below).
7. ✅ **#8 forge types** — done. ✅ **#9 corrupt-boot logging** — done. ✅ **#10 warmup list** — done (model-driven derivation, `warmupUtils.ts` + auto-collection list).

## Decisions made (2026-06-14)

- **#3 — authorization authority:** **(a) server-authoritative**. Client gate (`MachineSchemeValues`
  `#checkAccess`/`ACCESS_DENIED`) removed; `machine.rights.checkAccess` survives only as a UI hint
  (nav/buttons), never blocks rendering of server-returned rows.
- **#5 — fk resolution key:** ~~code-only~~ **CORRECTED** — `id` IS the canonical query key (`dataRelationUtils`
  reads it first), `code` is the lookup/create key. Both kept. Unified `resolveOrCreateByCode` primitive landed
  in idae-db (server-side, not qoolie — qoolie is client-only); `publishModel.ts` now resolves all fks eagerly,
  `resolveFkIds` post-pass removed. See [SEED.md](./SEED.md).
- **#2 — `ResultSet.loaded`:** **will never exist** (rejected as a future qoolie primitive — "code mal fait").
  Applied the interim fix permanently: explicit awaited `machine.collection(...).get(recordId)` when the
  reactive store doesn't have the record yet; `'absent'` only after that resolves empty.
- **#6 — org dropdown:** dev-only convenience, not a prod tenant picker. Static `config.ts` list stays. No
  API-served org list needed. Cancelled, is not a need.


