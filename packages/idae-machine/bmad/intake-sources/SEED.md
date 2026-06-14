# SEED.md — FK resolution & the seed pipeline

> Why this exists: the `id`-vs-`code` question in FK snapshots came up twice (UNHACK #5,
> and a wrong call on 2026-06-14 that briefly deleted `id` from `FkRef`). This is the
> authoritative answer so it never gets re-litigated from a half-memory.

---

## 1. The FK snapshot contract — both keys, on purpose

Every FK reference stored in a record's `fks` bag carries **two** resolution keys:

| key | role | who reads it |
|-----|------|--------------|
| `id` | **real autoincrement PK** of the target record. The canonical, fast query key. | `dataRelationUtils.resolveForwardRelations` reads `fks.{rel}.id` **first** (`targetIndex='id'`). |
| `code` | semantic natural key (`String`). The **lookup key** used to *find or create* the target, and the fallback when `id` is absent. | `resolveFkIds` (publish), `FkFolder`/seed resolver, and `dataRelationUtils` fallback (`obj['id'] ?? obj['code']`). |

`id` is **not** dead. `dataRelationUtils.ts` (≈L97-99):

```ts
const refId = obj['id'] ?? obj['code'];
const targetIndex = obj['id'] != null ? 'id' : 'code';
```

→ if `id` is present, queries hit the `id` index. Deleting `id` from the snapshot silently
forces every relation read onto the `code` index — a degradation, not a simplification.
**Keep both.**

Invariant restated: **every collection has `id` (auto PK) AND `code` (semantic string).**
`code` is the universal natural key — *tout le monde a un code* — which is exactly why it
can be the lookup key in a resolve-or-create.

---

## 2. The chicken-and-egg: problem or solution?

**The cycle is the problem; it's intrinsic.** Meta collections reference each other
(`appscheme` ↔ `appscheme_base` ↔ `appscheme_type` …) and business schemes reference other
schemes created later in the same loop. No single insertion order resolves every FK on first
write — that's structural, not a bug.

Given the cycle, there are **two valid strategies** to get a real `id` into an FK snapshot:

- **(A) Two-phase / post-pass** — write the snapshot with `id: null`, finish creating
  everything, then walk all docs and patch `id` by looking up the target by `code`.
  → This is `resolveFkIds`. It is a **solution**, not a hack. It works.
- **(B) Resolve-or-create at build time** — when building an FK to target `code`, look the
  target up by `code`; if it exists take its `id`, else **create a stub** keyed by `code` and
  take the new `id` immediately. No `null`, no second pass, no insertion-order constraint.
  When the target's full row is published later, an upsert-by-`code` matches the stub and
  fills the rest.

Both produce the same end state (real `id` + `code` in every snapshot). (B) is cleaner — it
removes the post-pass *and* the "referentials before dependents" ordering contract — but it
requires the resolve-or-create primitive to exist at the data layer.

---

## 3. Current implementation (as of 2026-06-14)

Two seed paths, two *different* implementations of the same idea — this duplication is the
real smell, not the chicken-egg itself.

### Meta / schema (`publishModel.ts`) — strategy (A)
- `fkRef()` builds snapshots with `id: null` (target may not exist yet).
- After the whole loop, `resolveFkIds(idaeDb)` walks every meta doc's `fks`, looks up each
  `{id:null, code}` entry's target collection by `code`, patches the real `id`.
- `seedEngineRegistries` pre-fills `baseRef[META.base].id` via an explicit `findOne` because
  the base root is created first (acyclic root).

### Business / AI data (`seedBusinessData.ts`, `seedAiData.ts`) — strategy (B), partial
- `seedBusinessData` keeps an in-memory `seedMap` (`collection → Map<id, record>`) built
  incrementally; `foldFks` resolves `fks.{rel}_{id}` denorm entries against it. **Requires
  referentials-before-dependents insertion order** (documented contract at top of file).
- `seedAiData` hand-rolls the same thing: insert providers → build `providerIdMap` from
  insertion order → resolve model FKs → insert models → `modelIdMap` → companions. Single
  pass, ordered. The `id` is **collé à la création** (resolved in-memory before insert), not
  in a post-pass.

So the answer to *"le id est créé à la création ou collé plus tard?"*:
- **meta path** → collé plus tard (`resolveFkIds` post-pass).
- **business/AI path** → résolu à la création (in-memory map, before insert).

Inconsistent. That's the thing worth fixing.

---

## 4. Target design — it's just an upsert

The repeated logic is a single operation: **"given a collection + a natural key (`code`),
return the row's `id`, creating the row if absent."** It is reimplemented in `publishModel`
(`upsertGetId` + `resolveFkIds`), in `seedBusinessData` (`seedMap` + `FkFolder`), and again in
`seedAiData` (`providerIdMap`/`modelIdMap`).

**This is just an upsert.** `upsertGetId` already is one (findOne + create/update). The *only*
reason it isn't a bare mongo upsert one-liner: **getting the autoincrement `id` back.** Mongo's
upsert returns `upsertedId` (the `_id`) only on *insert*, never on update — and that's the `_id`,
not idae-db's autoincrement `id` field. So you need `findOneAndUpdate(..., { returnDocument:
'after' })` (or a read-back) to recover `id`.

There is **no clobber risk** to guard against — so no `$setOnInsert` gymnastics:
- `code` is a **unique, deterministic** key. Upsert-by-`code` always hits the right row. A
  duplicate `code` is an upstream error to fix at its source, not something to defend against here.
- `$set` is **additive** — it only writes the fields you name, never erases siblings. An FK build
  writing a `{code}` stub onto an already-complete row just re-sets `code` to the same value;
  the target's full publish later `$set`s the rest. Order-independent, lossless either way.

So it collapses to the plain idiom:

```ts
// lives in idae-db, surfaced via idae-api. NOT qoolie — qoolie is the client mirror,
// the seed runs server-side.
findOneAndUpdate(
  { code },                               // unique key — always the right row
  { $set: data },                         // whatever you hold ({code} stub, or the full row)
  { upsert: true, returnDocument: 'after' }
).id                                        // → real autoincrement id, immediately
```

That's the whole thing — no new concept. With it:
- `fkRef()` resolves `id` eagerly at build time (strategy B) → delete `resolveFkIds`.
- The stub-then-fill across the cycle goes through the *same* upsert-by-`code`: the FK build
  inserts the stub, the target's full publish upserts the same `code` and fills it → chicken-egg
  gone, no post-pass, no insertion-order contract.
- `seedBusinessData` drops the in-memory `seedMap`; `seedAiData` drops `providerIdMap`/`modelIdMap`.
- One definition of "natural key → id", reseed-safe (re-running matches existing `code`s instead
  of duplicating).

**Not done yet** — the only real work is exposing this `$setOnInsert` + `returnDocument:'after'`
idiom cleanly in **idae-db** so it isn't hand-rolled a fourth time.

---

## 5. Decision log

- **2026-06-14:** `id` confirmed canonical query key (kept in `FkRef`). The earlier call to
  delete it was wrong and was reverted. UNHACK #5 reframed: the goal is **not** to drop `id`,
  it's to expose **one upsert idiom** (`$set` + `upsert:true` + `returnDocument:'after'`, no
  `$setOnInsert`) in idae-db (NOT qoolie — server-side) and collapse the three bootstrap copies
  (post-pass + two in-memory maps) into it.
- **2026-06-14 (later):** done for the meta path — `resolveOrCreateByCode` (in
  `server/src/bootstrap/resolveFkUtils.ts`) + `MongoDBAdapter.findOneAndUpdate` (idae-db) landed;
  `publishModel.ts` resolves all fks eagerly via `resolveFkRef`, `resolveFkIds` post-pass removed.
  `seedBusinessData`/`seedAiData` still use their own in-memory maps — optional follow-up, not
  required for UNHACK #5 to be considered done.
