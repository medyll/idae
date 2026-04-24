# Intake Sources — idae-machine

This folder contains existing project documentation and specifications that were present before BMAD initialization. These sources inform the product direction and technical decisions.

## Files

| File | Purpose | Key Signals |
|------|---------|-------------|
| `README.md` | Primary documentation, quick start, API overview | Mature library, v0.136.0, 186 tests, production-ready |
| `AGENTS.md` | AI coding agent guidelines | Detailed workflows for field types, components, validation |
| `docs/machine-architecture.md` | Architecture diagram (Mermaid) | Class hierarchy: MachineDb → MachineScheme → MachineSchemeField |
| `docs/API.md` | Complete API reference | Public API surface |
| `docs/EXAMPLES.md` | Usage examples | Common patterns and snippets |
| `package.json` | Dependencies and scripts | Svelte 5, Vitest, TypeScript, workspace deps |
| `src/lib/demo/testScheme.ts` | Demo schema (car rental) | Example: vehicles, customers, rentals collections |
| `CONCORDANCE.md` | (if exists) Standards compliance | Ferule standard alignment |

## Intent Reading

**Primary Purpose:**  
idae-machine is a schema-driven UI generation library that transforms TypeScript data models into fully-functional CRUD interfaces. It bridges the gap between data schemas (IndexedDB via idae-idbql) and reactive Svelte 5 components.

**Core Value Propositions:**
1. **Developer Experience:** Define schema once, get UI + validation automatically
2. **Performance:** Sub-millisecond field validation, 77x faster than targets
3. **Type Safety:** Full TypeScript support with Svelte 5 runes throughout
4. **Production Ready:** 186 tests, OWASP compliance, zero breaking changes

**Key Users:**
- SvelteKit developers building data-intensive applications
- Teams needing rapid CRUD UI generation from existing schemas
- Projects requiring offline-first IndexedDB with reactive UI

**Technical Constraints:**
- Svelte 5+ required (no legacy Svelte 4 support)
- IndexedDB only (via idae-idbql dependency)
- Workspace dependencies on @medyll/* packages

**Gaps / Open Questions:**
- ⚠️ Limited built-in field types (text, number, boolean, date, array) — currency/email/phone need custom
- ⚠️ No visual schema builder — developers must write TypeScript schemas
- ⚠️ Server sync not integrated — idae-sync mentioned as future direction
- ⚠️ Plugin architecture not implemented — custom renderers need core modification

## Signals for PM

**Strengths to leverage:**
- Mature codebase with comprehensive test coverage
- Clear architecture with well-separated concerns
- Strong documentation (README, AGENTS.md, API docs)

**Areas for enhancement:**
- Field type ecosystem (more built-in types)
- Developer tooling (schema builder, CLI)
- Integration story (sync, server-side rendering)

**Competitive positioning:**
- vs. react-admin: Svelte-native, schema-first, no boilerplate
- vs. Refine: Offline-first by default, simpler API
- vs. custom forms: 10x faster development, built-in validation
