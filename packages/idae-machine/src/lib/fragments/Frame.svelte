<script lang="ts">
	import { slide } from 'svelte/transition';

	let { showPanel = true, panelMode = 'expanded' } = $props<{
		showPanel?: boolean;
		panelMode?: 'expanded' | 'reduced';
	}>();
</script>

<div class="relative flex h-full gap-4">
	{#if showPanel}
		<div transition:slide={{ axis: 'x' }} class="paper h-64 w-64 overflow-auto overflow-x-hidden">
			<slot name="leftNav" />
		</div>
	{/if}
	<div class="flex-1">
		<div class="flex h-full w-96 flex-col gap-1">
			<slot />
		</div>
	</div>
</div>
