# MIGRATION_STATUS.md

Ce fichier suit l'avancement de la migration Svelte 5 et shadcn-svelte.

| Component/Step            | Status        | Notes                                                                 |
|--------------------------|---------------|-----------------------------------------------------------------------|
| Audit/Nettoyage Svelte 5  | ✅ Done       | Conformité Svelte 5, runes, $props                                    |
| Migration SCSS → CSS      | ✅ Done       | All SCSS converted to scoped CSS files                                |
| Tailwind v4 install       | ✅ Done       | `@tailwindcss/vite` installed; `@reference "tailwindcss"` in all styles |
| Inlining CSS into .svelte | ✅ Done       | Sprint 01 — all 17 `@import` violations removed (score: 920/920 ✅)  |
| Theme migration           | 🔄 In progress | `theme.css` with Tailwind v4 CSS variables — partially done          |
| Style/theme ajustements   | 🔄 In progress | shadcn-svelte color tokens (`--sld-*`) applied                        |
| shadcn-svelte intégration | 🔄 In progress | Components use shadcn-svelte conventions                              |
| Tests/validation          | 🔄 In progress | Sprint 02 — test baseline pending                                     |

### SCSS to CSS Migration Status

- **controls/**: Completed
- **data/**: Completed
- **navigation/**: Completed
- **ui/**: Completed
- **utils/**: Completed

All SCSS files have been migrated to CSS, and the corresponding Svelte components have been updated.

Mise à jour : première étape de nettoyage et conformité Svelte 5 terminée.
