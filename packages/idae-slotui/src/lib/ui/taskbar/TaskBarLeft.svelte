<!-- @component snippet component TaskBarLeft — for Taskbar -->
<script module lang="ts">
	export type TaskBarLeftProps = Record<string, any>;
</script>

<script lang="ts">
	const { children } = $props<TaskBarLeftProps>();
</script>

{#snippet TaskBarLeft()}
	{@render children?.()}
{/snippet}
