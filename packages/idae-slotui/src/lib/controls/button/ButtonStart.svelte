<!-- @component snippet component ButtonStart for root: Button -->
<script module lang="ts">
export type ButtonStartProps = Record<string, any>;
</script>

<script lang="ts">
  const { children, ...restProps } = $props<ButtonStartProps & { children?: any }>();
</script>

{#snippet buttonStart()}
  {@render children?.()}
{/snippet}
