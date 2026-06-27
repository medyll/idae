# CONVENTIONS.generated.md — règles d'écriture déduites du code

> Généré par `npm run conventions` le 2026-06-27. **Ne pas éditer à la main** — re-scanner.
> Source : 58 composants .svelte sous `src/lib` (hors tests/demo).
> Le nombre d'outliers est le thermomètre du drift : il doit tendre vers 0.

## Règles maison (adoption mesurée = le pattern dominant)

| Règle | Adoption | Statut |
|---|---|---|
| script en lang="ts" | 57/57 (100%) | ✅ loi |
| props via $props() (pas export let) | 42/42 (100%) | ✅ loi |
| pas de $: (runes $derived/$effect) | 58/58 (100%) | ✅ loi |
| pas de onMount (runes $effect) | 58/58 (100%) | ✅ loi |
| pas d'import svelte/store (runes only) | 58/58 (100%) | ✅ loi |
| pas de self-import @medyll/idae-machine | 58/58 (100%) | ✅ loi |
| si <style> + tag custom, règle display présente | 17/17 (100%) | ✅ loi |

_≥80% = convention de facto → traiter comme loi, corriger les déviants. <80% = pas de loi claire, décision utilisateur requise._

## Golden components (COPIE ÇA par famille)

| Famille | Golden (le plus conforme) | Score | Composants |
|---|---|---|---|
| `ai/frame` | `src/lib/ai/frame/AiChatSession.svelte` | 100% | 1 |
| `data-ui/controls` | `src/lib/data-ui/controls/ButtonAction.svelte` | 100% | 9 |
| `data-ui/data` | `src/lib/data-ui/data/DataFk.svelte` | 100% | 8 |
| `data-ui/field` | `src/lib/data-ui/field/DataField.svelte` | 100% | 11 |
| `data-ui/fragments` | `src/lib/data-ui/fragments/ContextMenu.svelte` | 100% | 6 |
| `shell` | `src/lib/shell/Frame.svelte` | 100% | 1 |
| `shell/auth` | `src/lib/shell/auth/Login.svelte` | 100% | 1 |
| `shell/frame` | `src/lib/shell/frame/dashboard/Dashboard.svelte` | 100% | 9 |
| `shell/layout` | `src/lib/shell/layout/App.svelte` | 100% | 12 |

## Outliers (déviants à corriger ou drift à tuer) — 0

_Aucun. Cohérence pleine._
