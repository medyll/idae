<!-- @component snippet component ButtonPopper — for Button -->
<script module lang="ts">
  export type ButtonPopperProps = Record<string, any>;
</script>

<script lang="ts">
  const { children } = $props<ButtonPopperProps>();
</script>

{#snippet buttonPopper()}
  {@render children?.()}
{/snippet}
