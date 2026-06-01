# Sprint 8 — Server Schema Delivery + Multi-DB Routing
**Goal:** Server reads appscheme_* → returns IdbqModel JSON. Data routes use correct DB per collection.
**Stories:** S8-01, S8-02
**Effort:** M+M
**Depends on:** S7-01, S6-01

| Story | Title | Effort | Status |
|-------|-------|--------|--------|
| S8-01 | GET /api/scheme → IdbqModel JSON | M | todo |
| S8-02 | data.ts multi-DB routing via appscheme | M | todo |

## New files
- `server/src/middleware/dbRouter.ts`

## Modified files
- `server/src/routes/scheme.ts`
- `server/src/routes/data.ts`

## Key invariant
`S8-01` and `S8-02` are independent — can be done in parallel.
Both require `S7-01` (appscheme_* must be seeded first).
