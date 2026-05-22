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

<style>
	.app-shell {
		display: flex;
		flex-direction: column;
		height: 100vh;
		overflow: hidden;
	}
	.app-content {
		flex: 1;
		overflow: auto;
		padding: 1rem;
	}
	.dev-wrap { position: relative; }
	.dev-toggle {
		padding: 3px 8px;
		font-size: 0.7rem;
		font-weight: 700;
		border: 1px solid #f59e0b;
		background: #fffbeb;
		color: #92400e;
		border-radius: 4px;
		cursor: pointer;
	}
	.dev-toggle.active,
	.dev-toggle:hover { background: #fef3c7; }
	.dev-dropdown {
		position: fixed;
		top: 36px;
		right: 8px;
		z-index: 9999;
		min-width: 280px;
		box-shadow: 0 4px 16px rgba(0,0,0,.2);
		border-radius: 6px;
	}
</style>
