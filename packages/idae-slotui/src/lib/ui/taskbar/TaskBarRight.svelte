<!-- @component snippet component TaskBarRight — small renderable part for Taskbar -->
<script lang="ts">
const { children } = $props();
</script>

{#snippet TaskBarRight()}
	{@render children?.()}
{/snippet}
