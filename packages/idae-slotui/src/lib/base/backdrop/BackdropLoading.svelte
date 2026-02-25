<!-- @component snippet component BackdropLoading — for Backdrop -->
<script module lang="ts">
  export type BackdropLoadingProps = any;
</script>

<script lang="ts">
  const { children } = $props();
</script>

{#snippet backdropLoading()}
  {@render children?.()}
{/snippet}

