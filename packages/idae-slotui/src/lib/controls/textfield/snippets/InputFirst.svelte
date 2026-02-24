 
<!-- @component snippet component for root: TextField -->

<script>
  // Destructure children and additional snippet props
  let { children, ...restProps } = $props();
</script>

{#snippet inputFirst()}
  {@render children?.()}
{/snippet}