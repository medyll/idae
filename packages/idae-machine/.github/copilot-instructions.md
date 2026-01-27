

# Copilot & AI Agent Instructions for `idae-machine`

> **Note:** This project is under active development. APIs and features may evolve rapidly.

## Project Overview
**idae-machine** is a Svelte 5 low-code framework for schema-driven CRUD UIs on IndexedDB, built atop `@medyll/idae-idbql` (data/query) and `@medyll/idae-slotui-svelte` (UI components). All data and UI logic flows through a layered architecture:

**Layered Architecture:**
- UI Components (Svelte 5) → Form Logic → Schema Definition (TypeScript) → IndexedDB Abstraction
- The `Machine` singleton manages schema, collections, and database access. See `docs/machine-architecture.md` for a class diagram.

**Core Classes:**
- `Machine`: Main entry, manages DB, schema, and exposes accessors for collections, state, and IndexedDB
- `MachineDb`: Central schema logic, creates/manages collections, uses `MachineParserForge` for field parsing
- `MachineScheme`: Represents a collection (table), provides access to field forges, values, and validation
- `MachineSchemeField`, `MachineSchemeFieldForge`, `MachineSchemeValues`, `MachineSchemeFieldValues`, `MachineSchemeValidate`: Handle field parsing, formatting, validation, and metadata
- `MachineError`, `MachineErrorValidation`: Custom error types for collection/validation logic
- `MachineParserForge`: Utility for parsing field rules and generating field metadata
- `IDbForge`: Structure returned by field parsing, used for metadata and UI logic

## Key Patterns & Conventions
- **Schema-first:** All collections, fields, and relations are declared in TypeScript objects (see `src/lib/demo/testScheme.ts` for examples)
- **Field types:** Use a string DSL (e.g., `'text (required)'`, `'fk-group.id'`, `'array-of-fk-agent.id'`)
- **CRUD UI:** Use `<CrudZone collection="agents" />` or compose with `<DataList>`, `<CreateUpdate>`, etc.
- **Reactivity:** Use Svelte 5 runes and `$derived` for live queries (see `idbqlState`)
- **Relations:** Foreign keys and reverse FKs are visualized with `<CollectionFks>` and `<CollectionReverseFks>`
- **Internal imports:** Use the `$lib` alias for maintainability
- **Strict Svelte 5:** All UI code must follow Svelte 5 syntax and conventions
- **jsDoc:** All classes/methods are documented with `@role`, `@param`, `@return` (see code for examples)

## Developer Workflows
- **Dev server:** `npm run dev` (auto-opens with `-- --open`)
- **Type check:** `npm run check`
- **Lint/format:** `npm run lint`, `npm run format`
- **Unit tests:** `npm run test:unit` (Vitest, covers all exported logic)
- **Single-run tests:** `npm run test`
- **Test schema:** See `src/lib/demo/testScheme.ts` for realistic test data
- **Coverage:** All logic in core modules is tested; see `CHANGELOG.md` for history

## Integration Points
- **@medyll/idae-idbql:** Query/migration/transaction engine for IndexedDB
- **@medyll/idae-slotui-svelte:** Svelte 5 UI primitives
- **Svelte 5:** All components and stores use runes and conventions

## File/Directory Guide
- `src/lib/demo/`: Example/test schemas
- `src/lib/main/`: Core logic (machine, parser, error types)
- `src/lib/form/`, `src/lib/fragments/`, `src/lib/ui/`: Svelte UI components
- `src/routes/`: Example app and demos
- `src/_old/`: Legacy code (for migration only)

## Special Notes
- **All PRs must comply with Svelte 5 and jsDoc rules**
- **Form validation pipeline** is in progress; see TODOs in code
- **For migration**, see `src/_old/` and migration notes in README

---
For more, see `README.md`, `docs/machine-architecture.md`, and in-code jsDoc. If unclear, ask for clarification or check referenced files.
