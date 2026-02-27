# BMAD integration for idae-slotui-svelte

This folder contains BMAD-related metadata and pointers for the `idae-slotui-svelte` project.

- Config: `bmad/config.yaml`
- Workflow status: `docs/bmm-workflow-status.yaml`
- Implementation standard: `docs/SHADCNSVELTE_GUIDELINES.md`

Adopted standard: Bits UI / shadcn-svelte for Svelte 5 (see above). Follow the guidelines when adding or migrating components in `src/lib/`.

Example: `docs/examples/example-component.md` contains a minimal Svelte 5 component template that follows the runes/snippet pattern.

Registry: This repo includes a shadcn-style registry at `registry/registry.json` and per-component metadata under `public/r/`.

To test locally (example):

```bash
# If you host registry.json at https://example.org/registry.json, users can run:
npx shadcn add https://example.org/r/button
```

Replace `https://example.org` with your hosted registry URL when ready.

Example usage (generate registry and summary):

```bash
# Generate registry from source (exclude demos/previews)
node scripts/generate-registry-from-lib.cjs --exclude="**/demo/**,**/preview/**"

# Generate pnpx/pmpx summary
node scripts/make-pnpx.cjs

# Or run packaging pre-step which runs both
npm run prepackage
```

Example: install a single component using the shadcn CLI (after hosting registry.json):

```bash
# When registry.json is hosted at https://ma-lib.dev/registry.json
npx shadcn add https://ma-lib.dev/r/button
```
