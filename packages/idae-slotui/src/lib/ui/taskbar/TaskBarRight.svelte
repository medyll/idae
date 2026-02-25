<!-- @component snippet component TaskBarRight — for Taskbar -->
<script module lang="ts">
	export type TaskBarRightProps = Record<string, any>;
</script>

<script lang="ts">
	const { children } = $props<TaskBarRightProps>();
</script>

{#snippet TaskBarRight()}
	{@render children?.()}
{/snippet}
