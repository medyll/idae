# Product Brief — @medyll/idae-machine

Generated: 2026-03-06 | Status: `bmad init` baseline

---

## Executive Summary

**@medyll/idae-machine** is a low-code UI framework for rapid CRUD interface generation. It bridges schema definition (TypeScript) and UI rendering (Svelte 5 components) to eliminate boilerplate form/list code.

| Aspect           | Detail                                        |
| ---------------- | --------------------------------------------- |
| **Type**         | NPM package (SvelteKit library)               |
| **Status**       | Early development (v0.135.2)                  |
| **Core Value**   | Schema → UI automation                        |
| **Target Users** | SvelteKit developers building data-heavy apps |
| **Primary Use**  | IndexedDB CRUD interfaces                     |

---

## Problem Statement

Building CRUD interfaces is repetitive:

- Define database schema
- Write form components (text inputs, dropdowns, validators)
- Wire UI to database queries
- Handle foreign keys and relationships
- Repeat for each collection

**idae-machine** solves this by declaring **one schema**, generating **rich UI for free**.

---

## Core Features (Current)

### 1. Schema-Driven UI Generation

- Declare collections with field rules in TypeScript
- Machine parses schema → generates form fields automatically
- Field types: text, number, boolean, date, email, foreign-key, array-of
- Rules: required, readonly, private

### 2. CRUD Zone Component

- Pre-built "Create-Read-Update-Delete" interface
- Unified sidebar list + detail view
- Click-to-edit inline or modal mode
- Single component: `<CrudZone collection="agents" />`

### 3. Relational Support

- Forward keys: `fk-category.id`
- Reverse keys: collection references pointing back
- Multi-collection transactions via IndexedDB

### 4. Form Validation

- Type-safe field rules
- Custom validators per field
- Error messaging
- Field-level required/readonly/private modifiers

### 5. Reactive Data Binding (Svelte 5)

- `$derived` for computed lists
- `$effect` for side effects
- Real-time UI updates on DB change
- `machine.idbqlState` for reactive queries

---

## Architecture Layers

```
┌─────────────────────────────────────┐
│     Svelte 5 UI Components          │
│  (CrudZone, DataList, FieldInPlace) │
├─────────────────────────────────────┤
│     Form Logic & Validation         │
│  (MachineSchemeValidate, etc)       │
├─────────────────────────────────────┤
│     Schema Introspection (Machine)  │
│  (MachineDb, MachineScheme, etc)    │
├─────────────────────────────────────┤
│     IndexedDB Abstraction (IDBQL)   │
│  (@medyll/idae-idbql)               │
└─────────────────────────────────────┘
```

---

## Key Dependencies

- **@medyll/idae-idbql**: MongoDB-like query engine for IndexedDB
- **@medyll/idae-slotui-svelte**: Base UI primitives (Button, MenuList, etc.)
- **svelte**: ^5.0.0 (strict Svelte 5 runes)
- **SvelteKit**: ^2.50.2 (for packaging/structure)

---

## Current Focus Areas

✅ **Done:**

- Core Machine class & schema parsing
- Basic field type detection
- Component exports (CrudZone, DataList, etc.)
- Unit test coverage (dbFields, schema logic)
- Svelte 5 compliance

🔄 **In Progress:**

- Form validation pipeline
- Field rendering (all DSL types)
- In-place editing UX

⏳ **Upcoming:**

- Nested form handling
- Advanced validation rules
- Migration guide (from legacy code)
- End-to-end CRUD workflows

---

## Known Constraints & Gaps

1. **Form Validation**: Partial — basic required/readonly, needs expansion
2. **Field Rendering**: DSL defined, but not all custom types render UI yet
3. **Nested Objects**: Not yet supported
4. **Permissions**: No role-based field visibility
5. **API Integration**: Works offline (IndexedDB); backend sync is manual

---

## Success Metrics

| Metric                 | Target | Current |
| ---------------------- | ------ | ------- |
| Unit test coverage     | >80%   | ~75%    |
| Components exported    | >5     | 5+      |
| Field types supported  | >10    | 8+      |
| Build time             | <5s    | ~3s     |
| Bundle size (minified) | <150KB | TBD     |

---

## Stakeholders & Communication

| Role         | Contact                 | Frequency       |
| ------------ | ----------------------- | --------------- |
| Maintainer   | Lebrun Meddy            | Ongoing         |
| Contributors | Community (GitHub)      | Ad-hoc          |
| Users        | SvelteKit dev community | Via docs/issues |

---

## Next Steps (Prioritized)

1. **Complete form validation** → `bmad plan spec`
2. **Add missing field type UI** → Custom field components
3. **Write end-to-end tests** → `bmad test e2e`
4. **Generate API docs** → `bmad doc --coauthor`
5. **Plan v1.0 roadmap** → `bmad plan roadmap`

---

See also:

- `README.md` (user guide)
- `AGENTS.md` (AI agent instructions)
- `SKILL.md` (project metadata)
- `docs/machine-architecture.md` (detailed architecture)
