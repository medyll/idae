<script lang="ts">
	import { machine } from '$lib/main/machine.js';

	let openFrames = $derived(machine.frameManager.openFrames);
</script>

<div class="taskbar">
	{#each [...openFrames] as [frameId, controls]}
		<div class="taskbar-item">
			<button type="button" class="taskbar-btn" onclick={() => controls.toggle()}>
				{frameId}
			</button>
			<button type="button" class="taskbar-close" onclick={() => controls.close()} aria-label="Close {frameId}">
				×
			</button>
		</div>
	{:else}
		<span class="taskbar-empty">No open frames</span>
	{/each}
</div>

<style>
	.taskbar {
		display: flex;
		gap: 4px;
		padding: 4px 8px;
		background: var(--color-surface);
		border-top: var(--border-width) solid var(--color-border);
		overflow-x: auto;
	}

	.taskbar-item {
		display: flex;
		align-items: center;
		gap: 2px;
	}

	.taskbar-btn {
		padding: 4px 12px;
		border: none;
		background: transparent;
		color: var(--color-text);
		cursor: pointer;
		font-size: var(--text-xs);
		border-radius: var(--radius-sm);
		white-space: nowrap;
	}

	.taskbar-btn:hover {
		background: var(--color-hover);
	}

	.taskbar-close {
		padding: 2px 6px;
		border: none;
		background: transparent;
		color: var(--color-text-muted);
		cursor: pointer;
		font-size: var(--text-sm);
		line-height: 1;
		border-radius: var(--radius-sm);
	}

	.taskbar-close:hover {
		background: var(--color-danger);
		color: white;
	}

	.taskbar-empty {
		color: var(--color-text-muted);
		font-size: var(--text-xs);
		padding: 4px 8px;
	}
</style>
