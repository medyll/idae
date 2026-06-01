<script lang="ts">
	import TaskBar from '$lib/shell/layout/TaskBar.svelte';
	import DevResetPanel from '$lib/shell/layout/DevResetPanel.svelte';

	let devPanelOpen = $state(false);
</script>

<div class="app-shell">
	<TaskBar>
		{#snippet devSlot()}
			{#if import.meta.env.DEV}
				<div class="dev-wrap">
					<button
						type="button"
						class="dev-toggle"
						class:active={devPanelOpen}
						onclick={() => devPanelOpen = !devPanelOpen}
					>⚠ DEV</button>
					{#if devPanelOpen}
						<div class="dev-dropdown">
							<DevResetPanel />
						</div>
					{/if}
				</div>
			{/if}
		{/snippet}
	</TaskBar>

	<main class="app-content" data-target-zone="main"></main>
</div>
