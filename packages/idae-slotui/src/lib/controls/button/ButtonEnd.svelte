<!-- @component snippet component ButtonEnd for root: Button -->
<script module lang="ts">
export type ButtonEndProps = Record<string, any>;
</script>

<script lang="ts">
  const { children, ...restProps } = $props<ButtonEndProps & { children?: any }>();
</script>

{#snippet buttonEnd()}
  {@render children?.()}
{/snippet}
