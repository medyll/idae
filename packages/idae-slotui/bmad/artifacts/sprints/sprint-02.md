# Sprint 02 – "Ship-Ready"

**Duration:** 2026-03-08 → 2026-03-14 (1 week)
**Capacity:** 1 developer — ~10 story points

## Sprint Goal

Make the library publishable and the registry functional: audit runtime dependencies, establish a real registry URL, validate the test baseline, and confirm the full `npm run prepackage → publish` pipeline works end to end.

---

## Stories

| ID | Epic | Title | Points | Priority |
|---|---|---|---|---|
| S02-01 | Deps | Audit `@medyll/idae-engine` — runtime vs. devDependency | 2 | Must |
| S02-02 | Deps | Audit `tailwind-merge` — confirm it belongs in `dependencies` | 1 | Must |
| S02-03 | Registry | Set real public registry URL + verify `registry.json` completeness | 2 | Must |
| S02-04 | Registry | Confirm snippet components bundled in parent registry entries | 1 | Should |
| S02-05 | Testing | Vitest baseline — at least 1 passing test per component category | 2 | Must |
| S02-06 | Testing | Playwright baseline — smoke test for key UI components | 2 | Should |

**Total:** 10 points

---

## Story Detail

### S02-01 – Audit `@medyll/idae-engine`
**Traced to:** ADR open question #3 / architecture.md
Currently in `devDependencies` but potentially imported by library components. If any `dist/` file imports from it at runtime, it must move to `dependencies` (or `peerDependencies`).

**How to check:**
```bash
grep -r "@medyll/idae-engine" src/lib/ --include="*.svelte" --include="*.ts"
```
If matches found in `src/lib/` (not just routes/docs): move to `dependencies`.

---

### S02-02 – Audit `tailwind-merge`
`tailwind-merge` is in `dependencies`. Confirm components actually import it at runtime (not just in tests/docs). If unused by `src/lib/`, move to `devDependencies`.

---

### S02-03 – Real registry URL
Replace the placeholder `https://example.org/registry.json` in:
- `bmad/config.yaml` → `registry.public_url`
- `docs/bmm-workflow-status.yaml` → `registry.public_url`
- `bmad/README.md` (usage examples)

Then run `npm run prepackage` and verify `registry/registry.json` is generated correctly (all components present, no broken file references).

---

### S02-04 – Snippet components in registry entries
Verify that for each component with snippet sub-components (e.g., `Button` + `ButtonStart`, `ButtonEnd`, etc.), all sibling `.svelte` files are listed in the component's `public/r/{name}.json` `files` array. Fix `generate-registry-from-lib.cjs` if they are missing.

---

### S02-05 – Vitest baseline
Run `npm run test:unit`. Identify which tests pass and which fail. Goal: at least one passing test per category (base, controls, data, navigation, ui). Document failures as backlog items, do not block sprint on them.

---

### S02-06 – Playwright baseline
Run `npm run test:integration` (requires `npm run build && npm run preview`). Confirm smoke tests pass for at minimum: Button, TextField, Drawer, Tabs. Document failures.

---

## Definition of Done (sprint-level)

- [ ] `@medyll/idae-engine` dependency classification resolved and `package.json` updated if needed
- [ ] `tailwind-merge` dependency classification confirmed
- [ ] Real registry URL set across all config files
- [ ] `npm run prepackage` exits 0 with complete `registry/registry.json`
- [ ] `npm run test:unit` runs (failures documented but not blocking)
- [ ] `npm run test:integration` runs (failures documented but not blocking)
- [ ] `npm run build && npm run package && publint` exits 0

## Dependencies

- Sprint 01 must be complete (0 ❌ violations, build passing)

## Risks

| Risk | Mitigation |
|---|---|
| `@medyll/idae-engine` is deeply embedded in component logic | If so, add to `peerDependencies` with a clear note in README |
| No real hosting for registry yet | Use GitHub Pages or a temporary static host; update URL accordingly |
| Playwright tests fail due to environment | Document failures, create S02-BUG stories, do not block shipping |
