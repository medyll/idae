<script module lang="ts">
export type InputLastProps = Record<string, any>;
</script>

<script lang="ts">
  const { children, ...restProps } = $props<InputLastProps & { children?: any }>();
</script>

{#snippet inputLast()}
  {@render children?.()}
{/snippet}