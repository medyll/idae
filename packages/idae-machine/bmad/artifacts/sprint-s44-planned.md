# Sprint 44 — Planned

> **Goal:** AI Chat Phase 1 (Core, non-agentic). Stand up the schema-driven chat: catalogs + chat collections, server SSE route over Ollama, the reusable `streamIntoRecord` helper, the `ai-prompt` field type, and a thin frame shell composed from `DataList`/`DataField`. **No `machine.ai` surface, no bespoke chat components, no `agentToolPolicy`** — see `bmad/intake-sources/CHAT.md` (full spec, rewritten 2026-06-12).

Date: 2026-06-12
Phase: release
Spec source: `bmad/intake-sources/CHAT.md` (§ references below are to that doc)

---

## Guardrails (apply to every story)

- **No `machine.ai`.** Reads via `machine.store(name, query?).records`; writes via `machine.collection(name)`; user-scoped upserts via `machine.action`. (CHAT.md §0, §3)
- **No bespoke chat components.** Input = the `ai-prompt` field type. Message list = `<DataList collection="ai_message">`. Bubble = `DataRecord`/`DataField`. Frames are one-line shells. (CHAT.md §6)
- **No inline enums.** Provider/model/mood/voice/status/tool are catalog records referenced via `fks`. No free-text `model` — always `fks.ai_model`. (CHAT.md §2)
- Svelte 5 runes only. Custom tags get explicit `display` CSS in `@layer components`. Activate `pseudo-html` then `css-base` skills before any markup/CSS.
- `pnpm run check` 0 errors and `pnpm run test` green are acceptance gates on every code story.

---

## Stories

### S44-01 — AI schema in server org scheme + pivot fields (M)

**Source:** CHAT.md §2.0–§2.6

**Context:** All AI collections are declared as `MachineModel` partials and spread into the server org schema (the runtime model loads from the server — `src/lib/ai/schema/*.ts` are reusable partials, **not** the live source). This story lands every collection with correct `fks`, `isType`/`isStatus` flags, and the **pivot fields** `collection` + `collectionId` on both `ai_chat_session` and `ai_message` (CHAT.md §2.2/§2.3 — the chat's anchor to a record of any collection).

**Files:**
- `src/lib/ai/schema/ai-catalogs.ts` — `ai_provider`, `ai_model` (with `supports_tools`, `fks.ai_provider`), `ai_mood`, `ai_voice`, `ai_specialization`, `ai_tool` (with `hitl`), `ai_skill`, `ai_hook`, `ai_chat_session_status`, `ai_message_status`, `ai_tool_call_status`
- `src/lib/ai/schema/ai-companion.ts` — `fks.ai_model` (required), no `model` field, no `ai_provider` FK
- `src/lib/ai/schema/ai-chat-session.ts` — **pivot `collection` + `collectionId`**, `fks.{ai_companion, ai_model, ai_chat_session_status, tag}`
- `src/lib/ai/schema/ai-message.ts` — **pivot `collection` + `collectionId`**, `fks.{ai_chat_session, ai_model, ai_message_status, ai_tool_call}`
- `src/lib/ai/schema/ai-tool-call.ts` — `fks.{ai_message, ai_tool, ai_tool_call_status}` (no free-text `tool_name`)
- `src/lib/ai/schema/tag.ts`, `src/lib/ai/schema/ai-user-prompt.ts`
- `server/src/migrate/mapping/` + `server/src/models/<org>/` — spread the partials into the demo org schema

**Acceptance criteria:**
- Every collection carries `id` + `code`; relations live in `fks` (target collection name = key), zero `*_id` columns in `fields`.
- `ai_chat_session.fields.collection`, `ai_chat_session.fields.collectionId`, `ai_message.fields.collection`, `ai_message.fields.collectionId` present.
- No `model` field anywhere — `ai_companion`/`ai_chat_session`/`ai_message` reference `fks.ai_model`.
- `ai_model.supports_tools` and `ai_tool.hitl` are boolean fields.
- Schema roundtrip test passes: server `getModel()` returns all AI collections; `findFkField`/`parseReverseFkFields` resolve the AI FKs.
- `pnpm run check` 0 errors.

**Dependencies:** none

---

### S44-02 — Server: `OllamaService` + `AiRouter` (`/send` SSE, `/models`) + context assembly (M)

**Source:** CHAT.md §4.4, §5

**Context:** Plain (non-agentic) provider chat. `OllamaService` wraps Ollama's ndjson stream via `parseStream(body, 'ndjson')`. `AiRouter` exposes the SSE `/send` (using `SseStream` from `@medyll/idae-api/server`) and `/models`. The route assembles the provider `messages[]` server-side: resolve model (`session.ai_model ?? companion.ai_model` → `ai_model` → provider), load last N `ai_message` ordered by base `dateCreated`, build the system prompt (session → companion → active `ai_user_prompt`), trim to `ai_model.context_size`.

**Files:**
- `server/src/ai/OllamaService.ts` — `streamChat()` async-generator + `listModels()`
- `server/src/ai/AiRouter.ts` — `POST /chat-session/:sessionId/send`, `GET /models`; `req.on('close')` → `AbortController`
- `server/src/ai/contextAssembly.ts` (or inline) — §4.4 steps 1–5
- `server/src/MachineServer.ts` — `app.use('/api/ai', AiRouter)`
- `server/package.json` — add `@medyll/idae-api`

**Acceptance criteria:**
- `POST /api/ai/chat-session/:id/send` streams `data: {"chunk": "..."}` frames then a `done` sentinel; aborts cleanly on socket close (no `AbortError` leak to client).
- `GET /api/ai/models` returns live Ollama models.
- Context assembly resolves model + system prompt per the documented order; trims oldest non-system messages to budget.
- Provider API keys read from env only (none in any client-reachable path).
- Server suite green; new `OllamaService`/context-assembly unit tests (mock fetch / mock stream).

**Dependencies:** S44-01 (schema for model/companion/session resolution)

---

### S44-03 — `streamIntoRecord` reusable helper (S)

**Source:** CHAT.md §4.2

**Context:** The only new client orchestration primitive. Pure function: streams an SSE endpoint into one field of one record, throttled IDB writes via `machine.collection(coll).update(id, { [field]: acc })`. **Zero `machine.*` surface exposure, zero Svelte imports.** Built on `@medyll/idae-api` `client.stream()`.

**Files:**
- `src/lib/ai/streamIntoRecord.ts` — `streamIntoRecord(opts): Promise<string>` per the §4.2 signature (`collection`, `recordId`, `field`, `slug`, `body`, `signal?`, `flushMs=120`, `onChunk?`, `pick?`)

**Acceptance criteria:**
- Accumulates deltas, flushes on a `flushMs` interval, final flush in `finally`, returns the accumulated string.
- Cancels cleanly on `signal.abort()` (interval cleared, last flush attempted).
- Unit test: mock `apiClient.stream` yielding chunks → asserts `col.update` called with growing accumulation and final value returned. Abort path test.
- No import of `svelte`, no `machine.ai`. `pnpm run check` 0 errors.

**Dependencies:** S44-02 (the `/send` endpoint it streams; testable in isolation with a mock)

---

### S44-04 — `ai-prompt` field type (`InputAiPrompt`) + `DataField` dispatch (M)

**Source:** CHAT.md §4.3

**Context:** The input bar **is a field**, not a component. New input atom `InputAiPrompt.svelte` registered as field type `'ai-prompt'`, dispatched by `DataField` like `InputBoolean`/`InputSelect`. Owns the textarea + send/abort + `AbortController`, and on submit runs the create-user / create-assistant-placeholder / `streamIntoRecord` / finalize orchestration (all via `machine.collection`). Receives the session record context from `DataField`.

**Files:**
- `src/lib/data-ui/input/InputAiPrompt.svelte` — §4.3 implementation; custom tag `ai-prompt` with explicit `display` in `@layer components`
- `src/lib/data-ui/field/DataField.svelte` — add dispatch branch `field type 'ai-prompt' → InputAiPrompt`, pass `session` context through
- `machine-model.ts` (or field-type registry) — register `'ai-prompt'` as a valid field `type` (CHAT.md §2 valid types list)

**Acceptance criteria:**
- `field('ai-prompt')` resolves through `DataField` to `InputAiPrompt`.
- Submit creates user message (`ai_message_status:'done'`), assistant placeholder (`'streaming'`), flips session status, streams into placeholder, finalizes (`'done'` + tokens) or errors (`'error'` + message), resets session status in `finally`.
- Stop button aborts the in-flight stream; placeholder marked `'error'`.
- `ai-prompt` tag has explicit `display` CSS. No `machine.ai`. Runes only.
- Component test (jsdom): mock `streamIntoRecord` + `machine.collection`; assert the create/update sequence and abort wiring.

**Dependencies:** S44-01, S44-03

---

### S44-05 — `AiChatSession` frame shell + registry + message bubble styling (M)

**Source:** CHAT.md §6

**Context:** The chat "view" is a **thin shell** with no chat logic: it reads the session via `machine.store('ai_chat_session', { id })`, renders `<DataList collection="ai_message" where={{ ai_chat_session: code }} sortBy="dateCreated">` for the transcript and `<DataField field="ai-prompt" {session} />` for input. Message bubbles are `DataRecord`/`DataField` over the `ai_message` template, styled by `role` + `ai_message_status` via `data-*` attributes (streaming cursor keyed on `status==='streaming'`). Frame opened via `machine.framer`.

**Files:**
- `src/lib/ai/frame/AiChatSession.svelte` — shell per §6 (custom tag `ai-chat-session-frame` + `display` CSS)
- `src/lib/main/router/componentRegistry.ts` — register `'ai.chat-session'` (and `'ai.chat-session.list'` stub for phase 2)
- Message bubble CSS — `@layer components`, keyed on `ai_message[data-role]` / `[data-status]`; `@medyll/css-base` tokens only, no hardcoded px/colors
- `role:'tool'` bubble path — render linked `ai_tool_call` (FK), confirm/cancel stub deferred to agentic phase (§13)

**Acceptance criteria:**
- Loading `'ai.chat-session'` via `machine.framer.loadIn('main', 'ai.chat-session', 'ai_chat_session', sessionId)` renders the transcript + input.
- Transcript updates reactively as `streamIntoRecord` patches messages (proves `machine.store` reactivity, invariant 10 — `records` getter, never flattened).
- All custom tags have `display`. `pnpm run check` 0 errors, 0 warnings.
- Frame never placed manually in HTML; only via `machine.framer`.

**Dependencies:** S44-04

---

### S44-06 — Demo seed: catalogs, statuses, models, companions, tags (S)

**Source:** CHAT.md §2.0 seeds, §2.1 seeds

**Context:** Seed the §2.0 catalogs and status records (with `ordre`), the `ai_model` catalog (with `supports_tools`/`context_size`/`fks.ai_provider`), the `ai_tool` catalog mirroring `listToolDescriptors()` (with `hitl` on destructive tools), 2 companion templates (`default`, `coder`), and a few default tags. Agent companion templates (`agent-*`) seeded only where the provider key resolves — but they are inert in Phase 1 (no agent route yet).

**Files:**
- `server/src/bootstrap/` seed data for the demo org — AI catalogs + statuses + models + companions + tags
- Status `ordre`: session `idle(1)→streaming(2)→error(3)`; message `idle(1)→sent(2)→streaming(3)→done(4)→error(5)`; tool_call `pending(1)→running(2)→done(3)→error(4)→cancelled(5)`

**Acceptance criteria:**
- `npx tsx server/src/bootstrap/bootstrap.ts demo` seeds all AI catalogs idempotently.
- `ai_model` rows carry correct `supports_tools` + provider FK; `ai_tool` rows carry `hitl` matching the destructive set.
- Seed test asserts row counts + key FK resolution (e.g. `ai_companion.default.ai_model === 'mistral'` → provider `ollama`).
- No data-loss on re-seed (idempotent / `upsertOn`).

**Dependencies:** S44-01

---

### S44-07 — Exports + full-suite verification (XS)

**Source:** CHAT.md §9

**Context:** Public surface + green gate. Export the AI schemas and `streamIntoRecord` (NOT a controller, NOT `machine.ai`). Run check + full suite.

**Files:**
- `src/lib/index.ts` — export `aiCatalogScheme`, `aiCompanionScheme`, `aiChatSessionScheme`, `aiMessageScheme`, `aiToolCallScheme`, `tagScheme`, `aiUserPromptScheme`, `streamIntoRecord`
- `src/lib/ai/schema/index.ts` (optional barrel)

**Acceptance criteria:**
- `pnpm run check` — 0 type errors.
- `pnpm run test` — full client + server suites green.
- `grep "machine\.ai"` src/ + server/src/ = 0. `grep "MachineAiController"` = 0. `grep "agentToolPolicy"` = 0.
- `grep` for a free-text `model:` field def in AI schemas = 0 (model is always `fks.ai_model`).
- Test results captured in `bmad/artifacts/test-results-sprint-44.md`.

**Dependencies:** S44-01 … S44-06

---

## Out of scope (Phase 1b / 2 — do NOT build here)

- Agent loop, providers, `AgentRouter`, `callTool` wiring, HITL confirm/cancel (CHAT.md §12–§14 — Sprint 45+).
- Multimodal attachments, skills slash-commands, hooks engine, audio/affective pipeline.
- `AiChatSessionList` beyond a registered stub.
- Any use of the pivot (`collection`/`collectionId`) beyond storing it — wiring "chat about this record" is a later sprint ("on verra quoi en faire").

## Implementation order

S44-01 → (S44-02 ∥ S44-03) → S44-04 → S44-05 → S44-06 → S44-07.
S44-02 and S44-03 are independent and can run in parallel after the schema lands.
