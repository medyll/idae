<script lang="ts">
	import { wStore } from '$lib/ui/window/store.js';
	import IconButton from '$lib/controls/buttonIcon/ButtonIcon.svelte';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	let { children, ...rest } = $props();
	function toggleWindow(frameId: string) {
		$wStore.activeFrame = frameId;
	}
</script>

{#each Object.keys($wStore.instances ?? {}) as key}
	<IconButton
		onclick={() => {
			toggleWindow(key);
		}}
		style="color:white;font-size: large"
		icon="home"
	/>
{/each}
<Slotted child={children}></Slotted>
