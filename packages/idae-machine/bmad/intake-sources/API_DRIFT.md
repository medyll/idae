# API_DRIFT.md — Transport architecture audit (qoolie / idae-sync / idae-api)

> Forensic record of how data flows from `idae-machine` to MongoDB, what the original intent was, where reality diverged, and what to do about it.
> Audience: humans + LLMs working in `D:/development/idae/packages/`. Read this before touching any HTTP transport, qoolie push listener, or `__stubs__/idae-api-stub.ts`.
> Date: 2026-06-07.

---

## TL;DR

- **Intent:** `qoolie` = unique query/CRUD layer. HTTP traffic = `@medyll/idae-api`. Wiring = `qoolie ← idae-sync ← idae-api`.
- **Reality (read/write business data):** matches intent. Clean.
- **Drift (push side):** `qoolie/src/lib/push/SSEListener.ts` + `WebSocketListener.ts` use raw `EventSource` / `WebSocket`, bypassing `idae-api`. Built 2026-03-29, when `idae-api` had no streaming primitives. Today (2026-06-07) `idae-api` gained `parseStream`/`SseStream` (`888865ee`) — push path is now refactor-eligible.
- **Dead-code suspects:** `src/lib/main/multi-base/MachineMultiBase.ts` + `src/lib/main/api/MachineApi.ts` — second direct-fetch surface, not called from `machine.boot()` or any `machine.*` getter. Probably residual from pre-qoolie era.
- **Two parallel push transports coexist:** Socket.IO (via `@medyll/idae-socket`, exposed as `machine.socket`) and qoolie's own SSE (`qoolie/src/lib/push/SSEListener.ts`). Not unified. Open question.
- **`idae-machine/src/lib/__stubs__/idae-api-stub.ts`** is NOT a replacement of idae-api. It is a **Vite alias** for browser bundles (idae-api was server-only at the time). Keep maintained in lockstep with the real client.

---

## 1. End-to-end chain — business data (read/write)

```
[browser] machine.collection('vehicle').create({...})
   │
   ▼
qoolie (Qoolie.ts) → IndexedDB local + enqueue Outbox
   │
   ▼
idae-sync (SyncAdapter) drain outbox → deliverer.deliver(entry)
   │
   ▼
idae-sync IdaeApiDeliverer (createIdaeApiDeliverer)
   │
   ▼
idae-api IdaeApiClientRequest → fetch(`${baseUrl}/api/data/:table[/:id]`)
   │
   ▼ HTTP
[server Express via @medyll/idae-api routes]
   │
   ▼
server/src/routes/data.ts → mongoose Schema {strict:false} per table
   │
   ▼
mongooseConnectionManager (from @medyll/idae-api) → ${org}_machine_app / ${org}_machine_user
   │
   ▼
MongoDB (config.mongodbUri / MONGODB_URI env)
```

**Key anchor files:**

- `idae-machine/src/lib/main/machine.ts` (`boot()` lines 238–296)
- `idae-machine/src/lib/main/machineSchemaLoader.ts` (boot-only `fetch('/api/scheme')`)
- `idae-machine/server/src/MachineServer.ts`
- `idae-machine/server/src/routes/data.ts`
- `idae-machine/server/src/routes/scheme.ts`
- `idae-sync/src/lib/deliverer/IdaeApiDeliverer.ts` (line 80 — only qoolie-adjacent file that imports `@medyll/idae-api`)
- `idae-sync/src/lib/SyncAdapter.ts`
- `idae-api/src/lib/client/IdaeApiClientRequest.ts` (line 73 `fetch`, line 164 streaming `doStream`)
- `idae-api/src/lib/client/IdaeApiStreamParser.ts` (`parseStream<T>(body, format, signal)`)
- `idae-api/src/lib/server/sse.ts` (`SseStream` server helper)
- `qoolie/src/lib/Qoolie.ts`
- `qoolie/src/lib/HydrationController.ts` (line 1 — `import type { IdaeApiDeliverer } from '@medyll/idae-sync'`, dependency-injected)
- `qoolie/src/lib/push/SSEListener.ts` (line 12, 44 — **raw `new EventSource(urlWithToken)`**, no idae-api)
- `qoolie/src/lib/push/WebSocketListener.ts` (**raw `new WebSocket(...)`**, no idae-api)

---

## 2. Original intent vs reality — verdict

| Concern | Intent | Reality | Status |
|---------|--------|---------|--------|
| qoolie as single query/CRUD layer | yes | yes | ✅ |
| qoolie itself imports idae-api | **no** — never intended; qoolie stays transport-agnostic | confirmed: `qoolie/package.json` has never depended on `@medyll/idae-api` (`git log -p packages/qoolie/package.json \| grep idae-api` empty) | ✅ |
| HTTP transport injected into qoolie via deliverer | yes (idae-sync.IdaeApiDeliverer) | yes — `HydrationController.deliverer.fetchAll(...)` | ✅ |
| Push/SSE/WebSocket via idae-api | implied — "idae-api for all HTTP client calls" | **NO — push/ uses raw browser primitives** | ⚠️ drift |
| idae-machine client uses idae-api directly for business data | **no** (must go via qoolie) | no — only 3 legitimate bypasses + 2 suspected-dead files | ✅ + 🔍 |

**Conclusion:** the read/write business-data path is correctly layered. The user's vertigo was about the wrong axis — qoolie wrapping idae-api was never the intent; the indirection lives in idae-sync. The **real drift is the push side**, and it has a chronological reason (idae-api lacked streaming until today).

---

## 3. Timeline — how we got here

| Date | Commit | Event |
|------|--------|-------|
| 2024-07-10 | `93fff5a5` | `chore(idae-api): initial` — package created (~21 months before audit). |
| 2026-03-29 | `8918e671` | qoolie Sprint 3 — `qoolie/src/lib/push/` created with `SSEListener.ts`, `WebSocketListener.ts`, `ServerPushListener.ts`. **Uses raw `EventSource` / `WebSocket`.** idae-api had no streaming primitives at this point — no other option. |
| 2026-05-19 | `63f5837c` | `idae-machine/src/lib/__stubs__/idae-api-stub.ts` created (alongside `idae-db-stub`, `jwt-stub`, `server-stub`, `skiller-stub`). Reason: idae-api was server-only and choked when bundled into SvelteKit browser build. Vite alias for browser bundles. |
| 2026-05-24 | `86ae2dc4` | qoolie `HydrationController.ts` created (S35-01/02/04/05). `import type { IdaeApiDeliverer } from '@medyll/idae-sync'`. Same commit adds `IdaeApiDeliverer.ts` in idae-sync. |
| 2026-05-25 | `2ff54e87` | `fix(sync): hydrate full collection by forwarding limit=0` — touches stub + deliverer + machine server. Stub is kept in lockstep with real client. |
| 2026-06-07 | `888865ee` | `feat(idae-api): add HTTP streaming support (SSE/ndjson/text)`. `parseStream`, `SseStream`, `client.stream()` land. **Push path now refactor-eligible.** |

---

## 4. Network traffic from `idae-machine/src/lib/` — exhaustive grep

`grep` of `src/lib/` for `fetch(` / `new EventSource` / `IdaeApiClient` returns only these direct-fetch surfaces:

| File | Endpoint | Justified? |
|------|----------|------------|
| `src/lib/main/machineSchemaLoader.ts:30,44` | `GET /api/scheme` | ✅ boot bootstrap — qoolie can't start without a schema |
| `src/lib/shell/auth/Login.svelte` | `POST /api/auth/login` | ✅ pre-auth, no session yet |
| `src/lib/shell/layout/DevResetPanel.svelte` | `POST /api/admin/reset` | ✅ dev tool |
| `src/lib/main/multi-base/MachineMultiBase.ts:161` | `GET /scheme/:tableCode` | 🔍 likely dead |
| `src/lib/main/api/MachineApi.ts` | direct fetch surface (schema/data domain) | 🔍 likely dead |
| `src/lib/__stubs__/idae-api-stub.ts` | (none — offline stub) | ✅ Vite alias only |

**Action:** grep monorepo for external callers of `MachineMultiBase` and `MachineApi`. If zero hits outside their own file, delete.

---

## 5. Push transports — duplication

Two live-push mechanisms coexist:

- **Socket.IO** via `@medyll/idae-socket` — wired as `machine.socket` (`EventDataClientInstance`). Server side: `server/src/socket/index.ts`.
- **qoolie SSE** via `qoolie/src/lib/push/SSEListener.ts` — raw `EventSource(urlWithToken)`. Owned by qoolie's hydration/sync layer.

**Open questions** (not resolved in this document):

1. What is each transport actually used for in production today?
2. Should Socket.IO replace qoolie's SSE (or vice-versa)?
3. If keeping both, document the boundary explicitly.

---

## 6. Refactor candidates (post-`888865ee`)

Now that `@medyll/idae-api` exposes `parseStream` (client) + `SseStream` (server), the following are refactor-eligible — they were written when no such primitive existed:

| File | Current | Refactor target |
|------|---------|-----------------|
| `qoolie/src/lib/push/SSEListener.ts` | raw `EventSource` | `client.stream({ format: 'sse', signal })` or `parseStream(body, 'sse', signal)` over fetch |
| `qoolie/src/lib/push/WebSocketListener.ts` | raw `WebSocket` | (WebSocket not in idae-api scope; keep raw, but at least share auth/URL helpers) |
| Any future SSE consumer in idae-machine (e.g. AI chat — see `CHAT.md`) | — | use `client.stream` / `SseStream` from idae-api directly |

**Do not** make `qoolie` depend on `@medyll/idae-api`. The `qoolie ← idae-sync ← idae-api` layering is deliberate. If push needs idae-api streaming, move the SSEListener implementation into idae-sync (or a new `@medyll/idae-push` package) and inject it into qoolie the same way the deliverer is injected.

---

## 7. Rules for future LLMs touching this stack

> ⚠️ Roadmap note: qoolie will gain **online-first collection mode** (per-collection flag, opt-in). When that lands, the boundary "qoolie = persistent only / idae-api = ephemeral" dissolves. Online-first collections will still go through `machine.collection` / `machine.store`, but qoolie will skip IDB persistence and proxy reads/writes/streams straight through its deliverer to idae-api. Rules below already anticipate this — they speak in terms of **ownership** (who decides the path), not transport.

1. **Never** import `@medyll/idae-api` inside `qoolie/`. Inject via deliverer / listener interface from `idae-sync`. This invariant holds for both offline-first and the upcoming online-first mode — online-first does not mean qoolie speaks HTTP directly, it means qoolie's deliverer is asked synchronously instead of via outbox.
2. **Never** add a raw `fetch(...)` in `idae-machine/src/lib/` for business-data operations. Use `machine.collection` / `machine.store` / `machine.action` regardless of whether the target collection is offline-first or online-first. The only sanctioned bypasses are: `/api/scheme` (boot), `/api/auth/login`, `/api/admin/reset`. Adding a fourth requires updating this document with the justification.
3. **`idae-api-stub.ts` is not an alternative** to idae-api. It is a Vite alias for browser bundles. Keep its public surface in lockstep with the real `IdaeApiClient` — any new method on idae-api (including `stream()` / `parseStream`) must be mirrored in the stub.
4. **For new SSE/streaming features** (AI chat tokens, progress gauges, live metrics): the transport primitive is `@medyll/idae-api` (`client.stream()` / `parseStream` client-side, `SseStream` server-side). **Where it is consumed depends on the collection mode:**
   - **Today (qoolie is offline-first only):** stream consumed directly from `idae-machine` via idae-api, results written to qoolie collections (or not, if ephemeral). E.g. AI chat in `CHAT.md` opens SSE itself and calls `machine.collection('ai_message').update(...)` on each chunk.
   - **Tomorrow (qoolie supports online-first collections):** a collection declared `mode: 'online-first'` can subscribe to a server stream as its native read path. Stream is owned by qoolie's deliverer; `machine.store(name)` exposes it reactively just like any other collection. Consumer code stays the same — only the schema flag changes.
   - **Always:** the transport library is idae-api. Never reinvent SSE/ndjson parsing.
5. **When in doubt about layering**, the decision tree is **ownership-first**, not transport-first:
   - "Is there a collection for this data?" → yes → go through `machine.collection` / `machine.store`. The collection's `mode` (offline-first / online-first / ephemeral-stream) decides whether qoolie persists, proxies, or just forwards.
   - "No collection — is this bootstrap (schema/auth/admin)?" → direct `fetch` in `idae-machine/src/lib/`, document in §4.
   - "No collection — is this a one-off ephemeral stream not modelled in the schema?" → idae-api `client.stream()` from `idae-machine`. Add to §4. Re-evaluate whether it should become an online-first collection instead.

---

## 8. Open items

- [ ] Confirm `MachineMultiBase.ts` and `MachineApi.ts` are dead; delete if so.
- [ ] Decide Socket.IO vs qoolie-SSE for push duplication.
- [ ] Refactor `qoolie/src/lib/push/SSEListener.ts` to use idae-api `parseStream` (via injected listener, not direct dep).
- [ ] Audit `hydrateAll` activation in `machine.ts:398` (gated, may not run in mobile-first mode — check).
- [ ] Mirror new idae-api `stream()` / `parseStream` surface in `__stubs__/idae-api-stub.ts` if idae-machine consumes them.
- [ ] **Design qoolie online-first collection mode**: per-collection `mode: 'offline-first' | 'online-first'` flag; online-first reads/writes proxy synchronously through the deliverer (no IDB persistence, no outbox); reactive subscriptions backed by idae-api stream when supported. Once landed, re-evaluate AI chat (`CHAT.md`) — `ai_chat` / `ai_message` are candidates for online-first.

---

## 9. Cross-references

- `idae-machine/CLAUDE.md` — surface API, invariants, frame model.
- `idae-machine/bmad/intake-sources/CHAT.md` — AI chat spec; consumes idae-api `parseStream` / `SseStream` directly per rule 4 above.
- `idae-machine/bmad/conventions.md` — code-style + dependency conventions.
- Memory: `project_qoolie_migration.md`, `project_qoolie_dual_bus_alias.md`.
