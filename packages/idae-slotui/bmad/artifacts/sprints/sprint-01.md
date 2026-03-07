# Sprint 01 – "Zero Violations"

**Duration:** 2026-03-01 → 2026-03-07 (1 week)
**Capacity:** 1 developer — ~10 story points

## Sprint Goal

Reach 100% compliance on COMPONENT_MAP.md by eliminating all 17 remaining `Css` ❌ violations (external `.css` file imports inside `<style>` blocks). Update MIGRATION_STATUS.md to reflect actual project state.

---

## Context

Global score is already 98.2% (903/920). The only remaining failures are all in the **Css** column — components that import external `.css` files (left over from the SCSS→CSS migration). Fix = remove the `@import` / `url(...)` from `<style>` blocks and inline the needed styles using Tailwind utilities or PostCSS directly.

Tailwind v4 is already installed and working (`@tailwindcss/vite` in `vite.config.js`). MIGRATION_STATUS.md is stale and will be corrected as a story.

---

## Stories

| ID | Epic | Title | Points | Priority |
|---|---|---|---|---|
| S01-01 | Compliance | Fix Css ❌ — `base/contentSwitcher/ContentSwitcher.svelte` | 1 | Must |
| S01-02 | Compliance | Fix Css ❌ — `data/` (7 components) | 3 | Must |
| S01-03 | Compliance | Fix Css ❌ — `navigation/tabs/Tabs.svelte` | 1 | Must |
| S01-04 | Compliance | Fix Css ❌ — `ui/` (8 components) | 3 | Must |
| S01-05 | Compliance | Verify 100% score — run `make-component-maps.js` + validate | 1 | Must |
| S01-06 | Housekeeping | Update MIGRATION_STATUS.md to reflect actual state | 1 | Should |

**Total:** 10 points

---

## Violation Detail

### base/ (1 violation)
| Component | Fix |
|---|---|
| `contentSwitcher/ContentSwitcher.svelte` | Remove `@import` of external CSS; inline styles via Tailwind |

### data/ (7 violations)
| Component | Fix |
|---|---|
| `dataList/DataList.svelte` | Remove `@import` of external CSS |
| `finder/Finder.svelte` | Remove `@import` of external CSS |
| `grouper/Grouper.svelte` | Remove `@import` of external CSS |
| `jsoner/Jsoner.svelte` | Remove `@import` of external CSS |
| `list/List.svelte` | Remove `@import` of external CSS |
| `sorter/Sorter.svelte` | Remove `@import` of external CSS |
| `sorter/Sorterer.svelte` | Remove `@import` of external CSS |

### navigation/ (1 violation)
| Component | Fix |
|---|---|
| `tabs/Tabs.svelte` | Remove `@import` of external CSS |

### ui/ (8 violations)
| Component | Fix |
|---|---|
| `bootstrapp/BootStrApp.svelte` | Remove `@import` of external CSS |
| `chromeFrame/ChromeFrame.svelte` | Remove `@import` of external CSS |
| `frame/Frame.svelte` | Remove `@import` of external CSS |
| `login/Login.svelte` | Remove `@import` of external CSS |
| `menu/Menu.svelte` | Remove `@import` of external CSS |
| `panel/Panel.svelte` | Remove `@import` of external CSS |
| `popper/Popper.svelte` | Remove `@import` of external CSS |
| `startMenu/BootMenu.svelte` | Remove `@import` of external CSS |

---

## Validation Checklist (Definition of Done)

- [ ] `node ./scripts/make-component-maps.js` → 0 ❌ in Css column
- [ ] COMPONENT_MAP.md global score = 100%
- [ ] `npm run build` exits 0
- [ ] `npm run check` exits 0
- [ ] `npm run test:unit` exits 0
- [ ] MIGRATION_STATUS.md updated to reflect Tailwind v4 as ✅ done

## Dependencies

- None — all fixes are self-contained per file

## Risks

| Risk | Mitigation |
|---|---|
| Removing CSS import breaks visual rendering | Run dev server and visually check each component; re-add styles inline if needed |
| Styles were non-trivial (complex selectors) | Prefer `@apply` with Tailwind or scoped PostCSS rather than deleting styles |
