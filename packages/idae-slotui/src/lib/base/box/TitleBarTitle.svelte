<!-- @component snippet component TitleBarTitle — for TitleBar -->
<script module lang="ts">
  export type TitleBarTitleProps = any;
</script>

<script lang="ts">
  const { children } = $props();
</script>

{#snippet titleBarTitle()}
  {@render children?.()}
{/snippet}

