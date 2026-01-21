
# Copilot & AI Agent Instructions for `idae-machine`

> **Note:** This project is currently in a building phase. Expect active development, evolving APIs, and incomplete features.


## Project Overview
- **idae-machine** is a Svelte 5 low-code framework for schema-driven CRUD UIs on IndexedDB, built atop `@medyll/idae-idbql` (data/query) and `@medyll/idae-slotui-svelte` (UI components).
- The architecture is layered: UI Components → Form Logic → Schema Definition (TypeScript) → IndexedDB Abstraction.
- All data flows through the `Machine` singleton, which manages schema, collections, and database access.

## Core Architecture & Data Flow

The core is organized as a set of collaborating classes, each with a focused responsibility. The main data and control flow is:

- **Machine**: Main entry point, manages the database, schema, and exposes accessors for collections, state, and IndexedDB.
- **MachineDb**: Central schema logic, creates/manages collections, uses `MachineParserForge` for field parsing.
- **MachineScheme**: Represents a collection (table), provides access to field forges, values, and validation. Key methods: `field(fieldName)`, `fieldForge(fieldName, data)`, `parse()`.
- **MachineSchemeField**: Handles parsing and metadata for a single field. Method: `parse()` returns an `IDbForge`.
- **MachineSchemeFieldForge**: Provides advanced metadata/formatting for a field, given a data object.
- **MachineSchemeValues**: Handles formatting/presentation of collection data, helpers for field values.
- **MachineSchemeFieldValues**: Introspects/formats individual field values, delegates to `MachineSchemeFieldForge`.
- **MachineSchemeValidate**: Validates form fields, throws `MachineErrorValidation` on error.
- **MachineError**: Custom error for collection logic, used for error handling in values/validation.
- **MachineErrorValidation**: Custom error for validation logic.
- **MachineParserForge**: Utility for parsing field rules and generating field metadata.
- **IDbForge**: Structure returned by field parsing, used for metadata and UI logic.

See `docs/machine-architecture.md` for a full class diagram and relationships.

## Key Patterns & Conventions
- **Schema-first**: All collections, fields, and relations are declared in TypeScript objects (see `src/lib/db/dbSchema.ts`).
- **Field types** use a string DSL (e.g., `'text (required)'`, `'fk-group.id'`).
- **CRUD UI**: Use `<CrudZone collection="agents" />` or compose with `<DataList>`, `<CreateUpdate>`, etc.
- **Reactivity**: Use Svelte 5 runes and `$derived` for live queries (see `idbqlState`).
- **Relations**: Foreign keys and reverse FKs are visualized with `<CollectionFks>` and `<CollectionReverseFks>`.
- **Internal imports** use the `$lib` alias for maintainability.
- **Strict Svelte 5**: All UI code must follow Svelte 5 syntax (see `AGENTS.md`).
- **jsDoc**: All classes/methods are documented with `@role`, `@param`, `@return`.

## Developer Workflows
- **Dev server**: `npm run dev` (auto-opens with `-- --open`)
- **Type check**: `npm run check`
- **Lint/format**: `npm run lint`, `npm run format`
- **Unit tests**: `npm run test:unit` (Vitest, covers all exported logic)
- **Single-run tests**: `npm run test`
- **Test schema**: See `src/lib/demo/testScheme.ts` and `testDbSchema.ts` for realistic test data.
- **Coverage**: All logic in `dbFields.ts` and related modules is tested; see `CHANGELOG.md` for history.

## Integration Points
- **@medyll/idae-idbql**: Query/migration/transaction engine for IndexedDB
- **@medyll/idae-slotui-svelte**: Svelte 5 UI primitives
- **Svelte 5**: All components and stores use runes and conventions

## File/Directory Guide
- `src/lib/db/`: Schema, field rules, validation, and TypeScript types
- `src/lib/main/`: Core logic (machine, parser, error types)
- `src/lib/form/`, `src/lib/fragments/`, `src/lib/ui/`: Svelte UI components
- `src/routes/`: Example app and demos
- `src/_old/`: Legacy code (for migration only)

## Special Notes
- **All PRs must comply with Svelte 5 and jsDoc rules** (see `AGENTS.md`).
- **Form validation pipeline** is in progress; see TODOs in code.
- **For migration**, see `src/_old/` and migration notes in README.

---
For more, see `README.md`, `AGENTS.md`, `docs/machine-architecture.md`, and in-code jsDoc. If unclear, ask for clarification or check referenced files.
