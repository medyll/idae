<script lang="ts">
  // Example Card primitive (minimal) — headless, styling-free
  const { id, children, ...rest } = $props();

  export type CardProps = { id?: string; children?: Snippet };
</script>

<article {...rest} id={id} role="region">
  {@render children?.()}
</article>

<style global lang="scss">
  /* No styles: consumers copy and style as needed */
</style>
