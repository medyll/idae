# SKILL.md Search Paths & Usage Examples

## Search Order

The CLI looks for `SKILL.md` in these locations (in order):

1. `src/lib/skill/<pkg>/SKILL.md` — Monorepo source (preferred)
2. `dist/skill/<pkg>/SKILL.md` — Built package
3. `lib/skill/<pkg>/SKILL.md` — Alternative location
4. `SKILL.md` — Package root (fallback)

## Usage Examples

### As a user installing a skill
```bash
cd node_modules/@medyll/qoolie
npx @medyll/qoolie add-skill
# Choose target (e.g., 1 for user-wide Claude)
```

### As a package author creating a skill
```bash
cd packages/my-package
npx @medyll/skiller create-skill --name my-package --description "My awesome package"
code lib/skill/my-package/SKILL.md
npm run build
npx @medyll/my-package add-skill
```
