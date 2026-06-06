# BMAD Open Space — idae-machine

Inter-role communication log.

---

## 2026-05-21 — App shell architecture decisions (replaces S25 assumptions)

### Root wrapper: `App.svelte`

NOT TemplateShell. Minimal wrapper — no sidebar, no navbar:

```
App.svelte
  <TaskBar />          ← frames ouvertes
  <div class="content"> ← zone centrale, cible des loadFrame
    <!-- vide au départ, frames montent ici -->
  </div>
```

No Frame component at root level — just a plain content zone.
TemplateShell is reserved for frame content (Explorer, etc.) — not root.

### Collection navigation

NOT in App sidebar (no sidebar exists). Loaded via loadFrame as a dedicated nav frame.
Details TBD (always-visible panel frame? or toggled?).

### Explorer props → sidebar: Option A

vars from loadFrame are passed as props to Explorer.
Explorer sidebar content driven by incoming vars, not self-derived from schema.

```ts
machine.loadFrame('explorer', 'vehicle', undefined, {
  mode:    'list',
  sidebar: 'filters',   // example var controlling sidebar content
})
// Frame passes vars as props → Explorer(collection, mode, sidebar, ...)
```

### +layout.svelte target state

```svelte
machine.init({ org: 'demo', domain: 'machine' }); // dbName = 'demo_machine' auto
await machine.fetchSchema('http://localhost:7842/api/scheme');
machine.initRouter({ baseUrl: '/', authEnabled: false });
// <App /> — no seedIfEmpty, no demoScheme import
```

### dbName convention

Always `{org}_{domain}` — never explicit. Same pattern as MongoDB (`demo_machine_app`).
Passing explicit dbName to machine.init() = forbidden in app code.

---

## 2026-05-12 — Component hierarchy + schema migration

- UI restructured: `collection/`, `lists/`, `data/`, `forms/` → `explorer/`, `card/`, `field/`, `input/`
- Schema format: string rules deprecated → `field()` builder + `TplFieldRulesObject` in idae-idbql
- `FieldDisplay` now dispatches to type-specific Input atoms
- `dbSchema.ts` + `demoScheme.ts` migrated to `field()` format
- See `CLAUDE.md` for full current state

---

## 2026-05-28 — DataList control prop naming

- Naming decision recorded for upcoming DataList toolbar refactor.
- Use `showControlX` for UI control visibility props.
- Canonical examples: `showControlSort`, `showControlGroup`, `showControlFind`, `showControlMode`.
- Keep state props separate: `sortBy`, `groupBy`, `where`, `mode`.

---

## 2026-04-24 — Reset to v2 planning (archived)

v1 → maintenance mode. v2 = full-stack with server, auth, sync.  
All sprints now completed. See `bmad/status.md`.
