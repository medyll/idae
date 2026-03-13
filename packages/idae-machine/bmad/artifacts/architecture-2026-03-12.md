# Architecture: @medyll/idae-machine

Date: 2026-03-12
Generated-by: bmad plan arch (assistant)

## Summary

@medyll/idae-machine is a Svelte 5 low-code framework that maps a TypeScript schema to reactive CRUD UI backed by IndexedDB via @medyll/idae-idbql. This document summarizes the runtime components, data flows, constraints, and next steps for the architecture artifact.

## High-level components

- Machine (singleton): lifecycle manager; init(), start(), exposes idbql and idbqlState, and provides accessors to collection schemas.
- MachineDb: schema introspection, caching MachineScheme instances, orchestration for parsing and migrations.
- MachineScheme / MachineSchemeField / MachineSchemeValues: per-collection metadata, formatting, validation helpers.
- MachineParserForge: pure parser that transforms field DSL strings into IDbForge metadata (type, format, validation rules).
- MachineSchemeValidate: validation logic; throws MachineErrorValidation on violation.
- UI Layer (Svelte 5 components): CreateUpdate, FieldInPlace, CollectionList, CollectionFks, etc. Components use Svelte 5 runes ($state, $derived, $effect) exclusively.
- IDBQL (@medyll/idae-idbql): reactive IndexedDB query engine, provides idbql (read-only) and idbqlState (reactive state) used by UI components.
- Storage: IndexedDB (managed by IDBQL). Optional backend synchronization via API (idae-api) is out-of-scope but supported.

## Data flow

1. App/UI calls Machine.init({dbName, version, model}) and Machine.start().
2. Machine constructs MachineDb and MachineScheme instances using MachineParserForge for field metadata.
3. Machine creates idbql stores; UI components derive queries from machine.idbqlState and render lists/forms.
4. Form inputs use MachineSchemeFieldForge for formatting and MachineSchemeValidate for validation before persisting via machine.idbql.<collection>.put/add.
5. IDBQL persists to IndexedDB and emits change events; UI reacts via idbqlState subscriptions and $derived selectors.

## Sequence (mermaid)

```mermaid
flowchart LR
  UI[UI Components (Svelte 5)] -->|calls| Machine[Machine singleton]
  Machine -->|creates| MachineDb[MachineDb & MachineScheme]
  MachineDb -->|parses rules| Parser[MachineParserForge]
  Machine -->|exposes| IDBQL[@medyll/idae-idbql]
  IDBQL -->|persists| IndexedDB[IndexedDB]
  IDBQL -->|reacts| UI
  MachineSchemeValidate -.->|validates| UI
```

## Constraints & non-functional requirements

- Svelte 5 runes only: `$state`, `$derived`, `$effect`; no legacy Svelte APIs.
- MachineParserForge must be pure and deterministic (no side effects).
- Type-safety: prefer generics and avoid `any` in public APIs.
- Migrations: rely on IDBQL version increments; Machine.start() triggers schema migrations.

## Security & audit notes

- Critical audit findings (see bmad/status.yaml audit.report) must be addressed; include secure defaults for FK handling and input validation.
- Sanitize user-provided formats and ensure MachineParserForge doesn't execute code.

## Recommended next steps

- Review this artifact with core maintainers and attach to sprint-1.
- Add architecture diagram to docs/ (SVG or mermaid render) and include in README.
- Add automated architecture checks (JSdoc coverage gating, type checks) to CI.
- Link implementation tasks: update MachineParserForge tests, MachineSchemeValidate tests, and Svelte component integration tests.

---

artifact: artifacts/architecture-2026-03-12.md
