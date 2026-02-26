<!--
Template: convert-mockup-template.html

This Markdown file contains the HTML template used by
`src/lib/tools/mockup/convert-mockup.js` to generate Svelte 5 component
scaffolds. The template includes placeholders that are replaced at
generation time:

- `{{COMPONENT_NAME}}` — PascalCase component name (e.g. ChatBubble)
- `{{TAG}}` — original mockup tag (e.g. chat-bubble)
- `{{ID}}` — id value or `null`
- `{{ATTRS_JSON}}` — JSON object of attributes

Use this file as a human-readable reference or to copy the template
into other tooling.
-->

```html
<!--
Template for convert-mockup.js
Placeholders:
  {{COMPONENT_NAME}} - PascalCase component name (e.g. ChatBubble)
  {{TAG}} - original mockup tag (e.g. chat-bubble)
  {{ID}} - id value or null
  {{ATTRS_JSON}} - JSON object of attributes
-->
<script module lang="ts">
  /**
   * Component: {{COMPONENT_NAME}}
   * Type definitions for external usage
   */
  export type {{COMPONENT_NAME}}Props = {
    children?: import('svelte').Snippet;
    [key: string]: any;
  };

  export const mockup = {{ATTRS_JSON}};
</script>

<script lang="ts">
  // '...rest' captures any other attributes (id, class, etc.)
  let { children, ...rest }: {{COMPONENT_NAME}}Props = $props();
</script>

<section class="{{TAG}}" {...rest}>
    {@render children?.()}
</section>

<style lang="postcss">
  .{{TAG}} {
    /* Component styles */
  }
</style>

```
