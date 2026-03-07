# Architecture – @medyll/idae-idbql

## Chosen Approach
Single-package, browser-only library with modular core, collection, and state layers. Chosen for simplicity, performance, and direct integration with Svelte 5.

## System Context Diagram
```
[User] ──► [Frontend App (Svelte 5)]
           │
           ▼
     [idae-idbql Library]
           │
           ▼
     [IndexedDB]
```

## Components
### IdbqlIndexedCore
- Responsibility: DB connection, schema, versioning
- Technology: TypeScript, IndexedDB
- Interfaces: exposes createIdbqDb, manages IDBDatabase
- Scaling strategy: browser async, no server

### CollectionCore
- Responsibility: CRUD, query abstraction
- Technology: TypeScript
- Interfaces: exposes CRUD/query methods
- Scaling strategy: per-collection, async

### State Layer
- Responsibility: Reactive state bridge
- Technology: Svelte 5 Runes, idae-stator
- Interfaces: exposes createIdbqlState, idbqlEvent
- Scaling strategy: UI-driven, async

## Architecture Decisions (ADR)
### ADR-01 – Browser-only, modular design
- Status: Accepted
- Context: Target users are frontend devs needing browser persistence
- Decision: No backend, modular layers for flexibility
- Consequences: Simpler integration, limited to browser

### ADR-02 – Reactive state via Svelte 5 Runes/idae-stator
- Status: Accepted
- Context: Svelte 5 is primary frontend target
- Decision: Use runes/idae-stator for reactivity
- Consequences: Seamless UI updates, strong typing

## Data Flow
### Flow: Reactive User List
1. User opens app
2. Frontend loads user collection
3. idae-idbql queries IndexedDB
4. State layer updates UI

## Deployment Architecture
| Environment | Infrastructure | Notes |
|---|---|---|
| Dev | Local browser | No server needed |
| Staging | N/A | N/A |
| Production | Browser | NPM package, CDN |

## Cross-Cutting Concerns
### Security
- No external data; all data stays in browser
- Input validation for queries

### Observability
- Logging: browser console
- Metrics: N/A
- Tracing: N/A
- Alerting: N/A

### Resilience
- Retry strategy: IndexedDB built-in
- Circuit breaker: N/A
- Backup / DR: User responsibility

## Open Architectural Questions
- [ ] Should we add server-side sync?
- [ ] Is modularity sufficient for future extensibility?
