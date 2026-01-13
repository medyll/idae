
# AGENTS.md

## Svelte 5 Coding Policy

All code in this project must strictly follow Svelte 5 syntax and conventions.

**Rules:**
- Only use Svelte 5 event, binding, and action syntax (e.g., `onclick`, not `on:click` or `use:click`).
- Do not use any deprecated or legacy Svelte 3 syntax (such as `on:click`, `bind:`, etc.).
- All pull requests must be fully compliant with Svelte 5 standards.
- Use Svelte 5-compatible linters and tools (e.g., `eslint-plugin-svelte`).

**References:**
- [Svelte 5 Documentation](https://svelte.dev/docs)
- [eslint-plugin-svelte](https://github.com/sveltejs/eslint-plugin-svelte)

Any code not respecting these rules will be rejected.
