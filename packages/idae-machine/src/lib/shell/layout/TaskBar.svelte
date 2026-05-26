<script lang="ts">
	import { machine } from '$lib/main/machine.js';
	import type { Snippet } from 'svelte';

	let { devSlot }: { devSlot?: Snippet } = $props();

	let openFrames = $derived(machine.framer.openFrames);

	function openExplorer() {
		machine.framer.loadFrame('explorer', 'vehicle');
	}
</script>

<div class="taskbar">
	<!-- Left: nav actions -->
	<div class="taskbar-left">
		<button type="button" class="taskbar-btn taskbar-btn--primary" onclick={openExplorer} title="Open Explorer">
			⊞ Explorer
		</button>
	</div>

	<!-- Center: open frames -->
	<div class="taskbar-frames">
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

	<!-- Right: dev panel slot + icons -->
	<div class="taskbar-right">
		{#if devSlot}
			{@render devSlot()}
		{/if}
		<button type="button" class="taskbar-icon" title="Settings (mock)">⚙</button>
		<button type="button" class="taskbar-icon" title="User (mock)">👤</button>
	</div>
</div>

<style>
	.taskbar {
		display: flex;
		align-items: center;
		gap: 4px;
		padding: 4px 8px;
		background: var(--color-surface);
		border-bottom: var(--border-width) solid var(--color-border);
		overflow-x: auto;
	}
	.taskbar-left {
		display: flex;
		align-items: center;
		gap: 4px;
		flex-shrink: 0;
	}
	.taskbar-frames {
		display: flex;
		align-items: center;
		gap: 4px;
		flex: 1;
		overflow-x: auto;
	}
	.taskbar-right {
		display: flex;
		align-items: center;
		gap: 4px;
		flex-shrink: 0;
	}
	.taskbar-item {
		display: flex;
		align-items: center;
		gap: 2px;
	}
	.taskbar-btn {
		padding: 4px 12px;
		border: 1px solid var(--color-border);
		background: transparent;
		color: var(--color-text);
		cursor: pointer;
		font-size: var(--text-xs);
		border-radius: var(--radius-sm);
		white-space: nowrap;
	}
	.taskbar-btn--primary {
		background: var(--color-primary, #4f46e5);
		color: #fff;
		border-color: transparent;
		font-weight: 600;
	}
	.taskbar-btn:hover { background: var(--color-hover); }
	.taskbar-btn--primary:hover {
		opacity: 0.9;
		background: var(--color-primary, #4f46e5);
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
	.taskbar-close:hover { background: var(--color-danger); color: white; }
	.taskbar-empty {
		color: var(--color-text-muted);
		font-size: var(--text-xs);
		padding: 4px 8px;
	}
	.taskbar-icon {
		padding: 4px 8px;
		border: none;
		background: transparent;
		cursor: pointer;
		font-size: 1rem;
		border-radius: var(--radius-sm);
	}
	.taskbar-icon:hover { background: var(--color-hover); }
</style>
