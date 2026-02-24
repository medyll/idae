<!-- @component snippet component TaskBarLeft — small renderable part for Taskbar -->
<script lang="ts">
const { children } = $props();
</script>

{#snippet TaskBarLeft()}
	{@render children?.()}
{/snippet}
