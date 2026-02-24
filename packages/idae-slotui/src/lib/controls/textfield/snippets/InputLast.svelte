<script module lang="ts">
  /* snippet component for root: TextField */ 
</script>

<script>
  // Destructure children and additional snippet props
  let { children, ...restProps } = $props();
</script>

{#snippet inputLast()}
  {@render children?.()}
{/snippet}