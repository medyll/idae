<!-- @component snippet component ButtonLoadingIcon — for Button -->
<script module lang="ts">
  export type ButtonLoadingIconProps = Record<string, any>;
</script>

<script lang="ts">
  const { children } = $props<ButtonLoadingIconProps>();
</script>

{#snippet buttonLoadingIcon()}
  {@render children?.()}
{/snippet}
