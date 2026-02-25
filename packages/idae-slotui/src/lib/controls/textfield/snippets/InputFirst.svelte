<!-- @component snippet component for root: TextField -->
<script module lang="ts">
export type InputFirstProps = Record<string, any>;
</script>

<script lang="ts">
  const { children, ...restProps } = $props<InputFirstProps & { children?: any }>();
</script>

{#snippet inputFirst()}
  {@render children?.()}
{/snippet}