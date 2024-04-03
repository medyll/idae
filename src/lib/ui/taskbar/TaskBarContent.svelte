<script lang="ts">
	import { wStore } from '$lib/ui/window/store.js';
	import IconButton from '$lib/controls/button/IconButton.svelte';

	function toggleWindow(frameId: string) {
		$wStore.activeFrame = frameId;
	}
</script>

{#each Object.keys($wStore.instances ?? {}) as key}
	<IconButton
		on:click={() => {
			toggleWindow(key);
		}}
		style="color:white;font-size: large"
		icon="home"
	/>
{/each}
<slot />
