<script lang="ts">
	import { machine } from '$lib/main/machine.js';
	import type { Snippet } from 'svelte';

	let { devSlot }: { devSlot?: Snippet } = $props();

	let openFrames = $derived(
		[...machine.framer.openFrames].filter(([, c]) => c.taskbar !== false)
	);

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
		{#each openFrames as [frameId, controls]}
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
