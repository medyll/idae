<!-- @component snippet component TitleBarIcon — for TitleBar -->
<script module lang="ts">
  export type TitleBarIconProps = any;
</script>

<script lang="ts">
  const { children } = $props();
</script>

{#snippet titleBarIcon()}
  {@render children?.()}
{/snippet}

