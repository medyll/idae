### Snippet Components Hardening Instructions (STRICT)

Purpose: standardize creation and maintenance of "snippet components".

    1) Scope and order
        - Process directories in this exact sequence: `controls/`, `data/`, `navigation/`, `ui/`, `utils/`.
        - a "snippet component" is a svelte component with the word "snippet component" in its content, referring to a parent component's snippet.


    2) Discovery (identification) 
    - The migration script `scripts/make-component-maps.js` can produce a preview list; run it locally to inspect results:
    ```powershell
    node .\scripts\make-component-maps.js
    ```
    - if the column Int. is ❌ , then there are chances this is a "snippet component" which need to be corrected.

    3) File placement rules (CRITICAL)
    - Do NOT create a `snippets/` subdirectory.
    - Do NOT move new components into a central directory.
    - Each generated snippet component MUST be created in the same directory as its parent component. Example: if `Button.svelte` lives in `src/lib/controls/button/`, then `ButtonStart.svelte` must also be created in `src/lib/controls/button/`.


    5) Component template (mandatory)
    - Every snippet file must include a `@component` HTML comment, use Svelte 5 runes for props. Keep implementations minimal.
    - The component must not contain "<style />"

Canonical template (replace types and names) STRICT:

```svelte
<!-- @component snippet component ButtonStart — for Button -->
<script module lang="ts">
	export type ButtonStartProps = any; // inherits from the snippet buttonStart declared in the module part of Button.svelte; ex: buttonStart: Snippet<[Record<string, any>]> => export type ButtonStartProps = Record<string, any>]>;
</script>

<script lang="ts">
	const { children } = $props();
</script>

{#snippet buttonStart()}
	{@render children?.()}
{/snippet}

```

6) Verification (mandatory)
- run the list command th see if Int. is ✅ for the component. It will create or update the file (COMPONENT_MAP.md)[COMPONENT_MAP.md]
```powershell
node .\scripts\make-component-maps.js
```