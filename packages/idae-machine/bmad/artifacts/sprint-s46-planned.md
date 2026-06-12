# Sprint 46 — Plan

**Goal:** Phase 2b — agentic write tools gated by human-in-the-loop confirmation (CHAT.md §13-14). Activate `create`/`update_by_id`/`delete_by_id`/`restore` in the agent tool filter; tools flagged `ai_tool.hitl = true` suspend the loop as `pending` until the user confirms or cancels via a resume route.

**Spec:** `bmad/intake-sources/CHAT.md` §13 (HITL), §14 (data flow), §10 Phase 2b.

## Stories

| ID | Title | Effort | Depends on |
|----|-------|--------|------------|
| S46-00 | `NormalizedTool.hitl` + `buildTools` resolves `ai_tool.hitl` per tool, includes write subset | S | S45-03 |
| S46-01 | `AgentLoop` suspends on HITL tool_calls — new `tool_pending` event, no `callTool`, loop ends | M | S46-00 |
| S46-02 | `AgentRouter` persists `ai_tool_call_status:'pending'` on `tool_pending`, ends SSE | M | S46-01 |
| S46-03 | `POST /agent/:sessionId/confirm/:toolCallId` — runs `callTool`, `pending`→`running`→`done`/`error`, resumes loop to completion | M | S46-02 |
| S46-04 | Cancel flow — `ai_tool_call_status:'cancelled'`, resume without executing, `tool_result` = "Cancelled by user" | S | S46-03 |
| S46-05 | UI: pending `ai_tool_call` in message bubble renders Confirm/Cancel (DataField actions) wired to confirm route | M | S46-02, S46-04 |

**Total estimate:** 2S + 4M ≈ Sprint 45-sized (6 stories, S45 also 2S+4M-equivalent).

## Dependencies

- S46-00 → S46-01 → S46-02 → {S46-03, S46-04} → S46-05. Mostly linear; S46-03/04 can interleave (same confirm route, different status branch).
- Builds directly on S45-01..04 (AgentLoop/AgentRouter/types.ts/message bubble) — no new schema needed (`ai_tool.hitl` and `ai_tool_call_status` enum incl. `pending`/`cancelled` already exist per S45-00).

## Out of scope (deferred to Phase 2 / later sprints)

- Skills (`/translate`, `/summarize`), hooks, `AiChatSessionList.svelte` history browser, context-window management, audio/affective pipeline (Phase 2 — separate sprint).
- Per-user/org token quota enforcement (Phase 2b item, but independent of HITL — candidate for Sprint 47 alongside Phase 2 kickoff).
- Mistral/Ollama HITL parity — same `AgentLoop`, no provider-specific changes expected, but not explicitly re-tested per provider this sprint (read-only S45-05 coverage stands).
